'use client'

import type { TFunction } from 'i18next'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  type DeliverableDomainQueryModel,
  type DeliverableId,
  type ProofStatus,
  type ServiceWithDeliverables,
  servicesWithDeliverables,
} from '@mntn-dev/domain-types'
import type {
  AfterUploadEvent,
  AfterUploadHandler,
} from '@mntn-dev/files-adapter-client'
import {
  createErrorMap,
  tooSmallRule,
  useForm,
  zodResolver,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service/client'
import { createContext, useToast } from '@mntn-dev/ui-components'

import type { ViewableFile } from '#components/files/viewer/types.ts'
import { useRefetchProject } from '#components/projects/use-refetch-project.ts'
import { useRefetchReview } from '#components/reviews/use-refetch-review.ts'
import { useRefetchProjectServices } from '#components/services/use-refetch-project-services.ts'
import {
  getFormSchema,
  isLeavingFeedback,
  isLeavingProposal,
} from '#utils/project/review-helpers.ts'
import {
  canViewPostProdDeliverableDetails,
  getActiveComment,
  getProofStatus,
} from '#utils/project/rounds-helpers.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import {
  getDeliverableName,
  getDeliverableService,
} from '~/lib/deliverables/deliverable-helpers.ts'
import { getDeliverablesFromServices } from '~/lib/services/service-helpers.ts'

export type UsePostProductionReviewProps = {
  project: ProjectWithAcl
  review: PostProductionSelectReviewOutput
  services: ServiceWithDeliverables<ProjectServiceWithAcl>[]
  selectedDeliverableId?: DeliverableId
}

const formId = 'post-prod-review-form'

const errorMapFactory = (
  t: TFunction<'validation'>,
  context?: Record<string, unknown>
) => createErrorMap(t, (t, ctx) => [tooSmallRule(t, ctx, 'more-info')], context)

export function usePostProductionReview({
  project,
  review,
  services,
  selectedDeliverableId,
}: UsePostProductionReviewProps) {
  const { t } = useTranslation(['generic', 'post-production-review', 'toast'])
  const { t: tValidation } = useTranslation('validation')
  const { showToast } = useToast()

  const { projectId } = project

  const [selectedTab, setSelectedTab] = useState('main')

  /** Deliverables Logic **/
  const deliverableServices = useMemo(
    () => servicesWithDeliverables(services),
    [services]
  )

  const deliverableServicesWithPostProdReview = useMemo(
    () =>
      deliverableServices.filter((service) =>
        service.deliverables.some(
          ({ details: { reviewLevel } }) => reviewLevel !== 'none'
        )
      ),
    [deliverableServices]
  )

  const deliverables = useMemo(
    () =>
      getDeliverablesFromServices(
        project.status === 'post_production'
          ? deliverableServicesWithPostProdReview
          : deliverableServices
      ),
    [project.status, deliverableServicesWithPostProdReview, deliverableServices]
  )

  const defaultDeliverable = useMemo(() => {
    return (
      deliverables.find(
        (deliverable) =>
          deliverable.deliverableId === selectedDeliverableId &&
          canViewPostProdDeliverableDetails(review, deliverable, project)
      ) || deliverables[0]
    )
  }, [deliverables, selectedDeliverableId, review, project])

  const [selectedDeliverable, setSelectedDeliverable] =
    useState<DeliverableDomainQueryModel>(
      defaultDeliverable as DeliverableDomainQueryModel
    )

  const handleDeliverableSelect = (
    deliverable: DeliverableDomainQueryModel
  ) => {
    setSelectedDeliverable(deliverable)
    setSelectedDeliverableFile(deliverable?.file ?? undefined)
    setSelectedTab('main')
  }

  const selectedDeliverableService = useMemo(
    () => getDeliverableService(selectedDeliverable, services),
    [selectedDeliverable, services]
  )

  const selectedDeliverableName = useMemo(
    () =>
      getDeliverableName(
        selectedDeliverable.details,
        selectedDeliverableService?.name
      ),
    [selectedDeliverable.details, selectedDeliverableService?.name]
  )

  const [selectedDeliverableFile, setSelectedDeliverableFile] = useState<
    ViewableFile | undefined
  >(selectedDeliverable.file)

  /** Mutations **/
  const attachFinalAssetToDeliverable =
    trpcReactClient.projects.attachFinalAssetToDeliverable.useMutation()
  const setProjectProcessingFinalFiles =
    trpcReactClient.projects.setProjectProcessingFinalFiles.useMutation()
  const submitFeedback =
    trpcReactClient.reviews.postProduction.submitFeedback.useMutation()
  const submitProposal =
    trpcReactClient.reviews.postProduction.submitProposal.useMutation()
  const updateFeedback =
    trpcReactClient.reviews.postProduction.updateFeedback.useMutation()
  const updateProposal =
    trpcReactClient.reviews.postProduction.updateProposal.useMutation()

  /** Refetchers **/
  const { refetchPostProductionReview } = useRefetchReview()
  const refetchProject = useRefetchProject()
  const refetchProjectServices = useRefetchProjectServices({ projectId })

  const refetchReview = async () => {
    return await refetchPostProductionReview(projectId)
  }

  /** Form-Specific Logic **/
  const formRef = useRef<HTMLFormElement | null>(null)

  const formSchema = useMemo(
    () => getFormSchema(review, tValidation),
    [review, tValidation]
  )
  const subject = useMemo(() => t('generic:deliverable'), [t])
  const context = useMemo(
    () => ({
      subject,
    }),
    [subject]
  )

  const defaultValues: { status: ProofStatus | null; note: string } = {
    status: null,
    note: '',
  }

  const form = useForm({
    defaultValues,
    resolver: zodResolver(formSchema, tValidation, {
      errorMap: errorMapFactory(tValidation, context),
    }),
  })

  const setFormRef = useCallback((ref: HTMLFormElement | null) => {
    formRef.current = ref
  }, [])

  const submitForm = useCallback(() => {
    formRef.current?.requestSubmit()
  }, [])

  const onValidFormSubmit = async (data: {
    note?: string
    status?: ProofStatus
  }) => {
    if (isLeavingProposal(review)) {
      await handleAddProposalComment(data.note || null)
    }
    if (isLeavingFeedback(review)) {
      const updates = {
        ...(data.status && { status: data.status }),
        ...(data.note && { notes: data.note }),
      }
      await handleUpdateFeedback(updates)
    }

    await refetchReview()
  }

  const handleAddProposalComment = async (comment: string | null) => {
    await updateProposal.mutateAsync({
      projectId: review.project.projectId,
      deliverableId: selectedDeliverable.deliverableId,
      updates: { notes: comment || null },
    })
  }

  const handleUpdateFeedback = async ({
    status,
    notes,
  }: {
    status?: ProofStatus
    notes?: string | null
  }) => {
    const updates = { ...(status && { status }), ...(notes && { notes }) }
    await updateFeedback.mutateAsync({
      projectId: review.project.projectId,
      deliverableId: selectedDeliverable.deliverableId,
      updates,
    })
  }

  /** Event Handlers **/
  const handleProofAfterUpload: AfterUploadHandler = async (
    e: AfterUploadEvent
  ) => {
    await updateProposal.mutateAsync({
      projectId: projectId,
      deliverableId: selectedDeliverable.deliverableId,
      updates: { fileId: e.file.fileId },
    })

    setSelectedDeliverableFile(e.file)

    await refetchReview()
  }

  const handleFinalAssetAfterUpload: AfterUploadHandler = async (
    e: AfterUploadEvent
  ) => {
    await attachFinalAssetToDeliverable
      .mutateAsync({
        projectId: selectedDeliverable.projectId,
        deliverableId: selectedDeliverable.deliverableId,
        fileId: e.file.fileId,
      })
      .then(() => {
        showToast.info({
          title: t('toast:file.added.title'),
          body: t('toast:file.added.body'),
          dataTestId: 'file-added-info-toast',
          dataTrackingId: 'file-added-info-toast',
        })
      })

    setSelectedDeliverableFile(e.file)

    await refetchProject(project)
    await refetchProjectServices()
  }

  // Update state when selectedDeliverable changes
  useEffect(() => {
    const updatedNote = getActiveComment(
      review,
      selectedDeliverable.deliverableId
    )
    const updatedStatus = getProofStatus(
      review.currentRound,
      selectedDeliverable.deliverableId
    )

    form.reset({
      note: updatedNote,
      status: updatedStatus,
    })
  }, [selectedDeliverable, review, form])

  /** Return Values **/
  return {
    defaultDeliverable,
    deliverables,
    form,
    formId,
    handleAddProposalComment,
    handleDeliverableSelect,
    handleFinalAssetAfterUpload,
    handleProofAfterUpload,
    handleUpdateFeedback,
    onValidFormSubmit,
    project,
    projectId,
    refetchProject,
    refetchProjectServices,
    refetchReview,
    review,
    selectedDeliverable,
    selectedDeliverableFile,
    selectedDeliverableName,
    selectedDeliverableService,
    selectedTab,
    services,
    setFormRef,
    setProjectProcessingFinalFiles,
    setSelectedDeliverable,
    setSelectedDeliverableFile,
    setSelectedTab,
    showToast,
    submitFeedback,
    submitForm,
    submitProposal,
    t,
  }
}

export const [PostProductionReviewProvider, usePostProductionReviewContext] =
  createContext<ReturnType<typeof usePostProductionReview>>({
    name: 'PostProductionReviewContext',
  })
