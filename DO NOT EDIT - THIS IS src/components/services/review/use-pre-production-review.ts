'use client'

import type { TFunction } from 'i18next'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import {
  type ActivityDomainQueryModel,
  ActivityTypeFilter,
  type FileId,
  ProjectServiceUrn,
} from '@mntn-dev/domain-types'
import {
  createErrorMap,
  tooSmallRule,
  useForm,
  zodResolver,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { PreProductionSelectReviewOutput } from '@mntn-dev/review-service'
import { createContext, useToast } from '@mntn-dev/ui-components'
import { isNotDefined } from '@mntn-dev/utilities'

import { useRefetchReview } from '#components/reviews/use-refetch-review.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import {
  getNoteForPhase,
  getNoteUpdateSchemaForPhase,
  getPhase,
} from './utils.ts'

export type UsePreProductionReviewProps = {
  initialReview: PreProductionSelectReviewOutput
}

const formId = 'project-service-form'

export type MainTab = 'details' | 'history'
export type AsideTab = 'files' | 'activity'

const errorMapFactory = (
  t: TFunction<'validation'>,
  context?: Record<string, unknown>
) => createErrorMap(t, (t, ctx) => [tooSmallRule(t, ctx, 'more-info')], context)

const isChangeRequestDefault = false

export function usePreProductionReview({
  initialReview,
}: UsePreProductionReviewProps) {
  const [currentMainTab, setCurrentMainTab] = useState<MainTab>('details')
  const [currentAsideTab, setCurrentAsideTab] = useState<AsideTab>('files')

  const formRef = useRef<HTMLFormElement | null>(null)

  const router = useRouter()
  const { showToast } = useToast()

  const { t } = useTranslation(['generic', 'toast'])
  const { t: tValidation } = useTranslation('validation')

  // Review query - only fetch if we're in review mode
  const reviewQuery =
    trpcReactClient.reviews.preProduction.selectReview.useQuery(
      { projectServiceId: initialReview.service.projectServiceId },
      {
        initialData: { review: initialReview },
      }
    )

  const review = reviewQuery.data?.review

  if (isNotDefined(review)) {
    throw new Error('Review is undefined')
  }

  const {
    project: { preProductionReviewRounds = 0, status: projectStatus },
    service,
  } = review

  const { projectId, projectServiceId } = service

  const preProductionReviewRoundsUsed = review.currentRoundNumber - 1

  const phase = useMemo(() => getPhase(review), [review])

  const schema = useMemo(
    () => getNoteUpdateSchemaForPhase(phase, tValidation),
    [phase, tValidation]
  )
  const note = useMemo(() => getNoteForPhase(phase, review), [phase, review])

  const defaultValues = {
    isChangeRequest: isChangeRequestDefault,
    note,
  }

  const subject = useMemo(() => t('generic:service'), [t])
  const context = useMemo(
    () => ({
      isRequired: false,
      subject,
    }),
    [subject]
  )

  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema, tValidation, {
      errorMap: errorMapFactory(tValidation, context),
    }),
    context,
  })

  const remainingPreproductionRounds = useMemo(
    () => preProductionReviewRounds - preProductionReviewRoundsUsed,
    [preProductionReviewRounds, preProductionReviewRoundsUsed]
  )

  // Queries
  const folderUrn = ProjectServiceUrn(projectServiceId)
  const filesQuery = trpcReactClient.files.list.useQuery({
    where: { folderUrn },
  })
  const files = useMemo(() => filesQuery.data ?? [], [filesQuery.data])

  const { refetchPreProductionReview } = useRefetchReview()

  const activityQuery =
    trpcReactClient.projects.getProjectServiceActivity.useQuery({
      projectServiceId,
      activityType: [
        'pre_production_review_brand_feedback_submitted',
        'pre_production_review_maker_proposal_submitted',
      ],
    })

  const activity = useMemo<
    ActivityDomainQueryModel<
      | 'pre_production_review_brand_feedback_submitted'
      | 'pre_production_review_maker_proposal_submitted'
    >[]
  >(
    () =>
      (activityQuery.data ?? []).filter(
        ActivityTypeFilter(
          'pre_production_review_maker_proposal_submitted',
          'pre_production_review_brand_feedback_submitted'
        )
      ),
    [activityQuery.data]
  )

  // Mutations
  const updateProposal =
    trpcReactClient.reviews.preProduction.updateProposal.useMutation()
  const submitProposal =
    trpcReactClient.reviews.preProduction.submitProposal.useMutation()
  const updateFeedback =
    trpcReactClient.reviews.preProduction.updateFeedback.useMutation()
  const requestChanges =
    trpcReactClient.reviews.preProduction.requestChanges.useMutation()
  const approveChanges =
    trpcReactClient.reviews.preProduction.approveChanges.useMutation()

  const handleBack = useCallback(() => {
    router.backOrPush(route('/projects/:projectId').params({ projectId }))
  }, [projectId, router])

  const onValidFormSubmit = async (data: {
    note: string
    isChangeRequest: boolean
  }) => {
    switch (phase) {
      case 'maker-proposal':
        await saveMakerProposal(data.note)
        break
      case 'brand-feedback':
        await saveBrandFeedback(data.note, data.isChangeRequest)
        break
      default:
        throw new Error('Invalid phase')
    }

    await refetchPreProductionReview(projectServiceId)
    handleBack()
  }

  const saveMakerProposal = async (note: string) => {
    try {
      if (note && review.acl.canSubmitProposal) {
        await submitProposal.mutateAsync({
          projectServiceId,
          notes: note,
        })

        await refetchPreProductionReview(projectServiceId)
      }
    } catch (_error) {
      showToast.error({
        title: t('toast:service.error.title'),
        body: t('toast:service.error.body'),
        dataTestId: 'service-error-toast',
        dataTrackingId: 'service-error-toast',
      })
    }

    showToast.info({
      title: t('service.proposal-submitted.title', { ns: 'toast' }),
      body: t('service.proposal-submitted.body', {
        ns: 'toast',
        name: service.name,
      }),
      dataTestId: 'service-proposal-submitted-info-toast',
      dataTrackingId: 'service-proposal-submitted-info-toast',
    })
  }

  const saveBrandFeedback = async (note: string, isChangeRequest: boolean) => {
    if (isChangeRequest) {
      try {
        if (note && review.acl.canRequestChanges) {
          await requestChanges.mutateAsync({
            projectServiceId,
            notes: note,
          })

          await refetchPreProductionReview(projectServiceId)
        }
      } catch (_error) {
        showToast.error({
          title: t('toast:service.error.title'),
          body: t('toast:service.error.body'),
          dataTestId: 'service-error-toast',
          dataTrackingId: 'service-error-toast',
        })
      }

      showToast.info({
        title: t('service.changes-requested.title', { ns: 'toast' }),
        body: t('service.changes-requested.body', {
          ns: 'toast',
          name: service.name,
        }),
        dataTestId: 'deliverable-changes-requested-info-toast',
        dataTrackingId: 'deliverable-changes-requested-info-toast',
      })
    } else {
      try {
        if (review.acl.canApproveChanges) {
          await approveChanges.mutateAsync({
            projectServiceId,
            ...(note ? { notes: note } : {}),
          })

          await refetchPreProductionReview(projectServiceId)
        }
      } catch (_error) {
        showToast.error({
          title: t('toast:service.error.title'),
          body: t('toast:service.error.body'),
          dataTestId: 'service-error-toast',
          dataTrackingId: 'service-error-toast',
        })
      }

      showToast.success({
        title: t('service.approved.title', { ns: 'toast' }),
        body: t('service.approved.title', { ns: 'toast', name: service.name }),
        dataTestId: 'deliverable-approved-success-toast',
        dataTrackingId: 'deliverable-approved-success-toast',
      })
    }
  }

  const {
    getValues,
    formState: { isDirty },
  } = form

  const onSaveAndBack = useCallback(async () => {
    const currentNote = getValues('note')

    if (isDirty) {
      if (phase === 'brand-feedback') {
        if (review.acl.canUpdateFeedback) {
          await updateFeedback.mutateAsync({
            projectServiceId,
            updates: { notes: currentNote },
          })
        }
      }
      if (phase === 'maker-proposal') {
        if (review.acl.canUpdateProposal) {
          await updateProposal.mutateAsync({
            projectServiceId,
            updates: { notes: currentNote },
          })
        }
      }
    }

    await refetchPreProductionReview(projectServiceId)
    handleBack()
  }, [
    updateFeedback.mutateAsync,
    updateProposal.mutateAsync,
    getValues,
    handleBack,
    phase,
    projectServiceId,
    refetchPreProductionReview,
    review.acl,
    isDirty,
  ])

  const onSelectPreviewFile = useCallback(
    (fileId: FileId) => {
      router.push(
        route('/projects/:projectId/files/:fileId').params({
          projectId,
          fileId,
        })
      )
    },
    [projectId, router]
  )

  const noteUpdateLoading = useMemo(
    () =>
      updateFeedback.isPending ||
      updateProposal.isPending ||
      submitProposal.isPending ||
      requestChanges.isPending ||
      approveChanges.isPending,
    [
      updateFeedback.isPending,
      updateProposal.isPending,
      submitProposal.isPending,
      requestChanges.isPending,
      approveChanges.isPending,
    ]
  )

  const setFormRef = useCallback((ref: HTMLFormElement | null) => {
    formRef.current = ref
  }, [])

  const submitForm = useCallback(() => {
    formRef.current?.requestSubmit()
  }, [])

  return {
    activity,
    activityLoading: activityQuery.isPending,
    currentAsideTab,
    currentMainTab,
    feedbackSaving:
      updateFeedback.isPending ||
      requestChanges.isPending ||
      approveChanges.isPending,
    files,
    filesLoading: filesQuery.isPending,
    filesQuery,
    folderUrn,
    form,
    formId,
    noteUpdateLoading,
    onBack: handleBack,
    onSaveAndBack,
    onSelectPreviewFile,
    onValidFormSubmit,
    phase,
    preProductionReviewRounds,
    preProductionReviewRoundsUsed,
    projectServiceId,
    projectStatus,
    proposalSaving: updateProposal.isPending || submitProposal.isPending,
    remainingPreproductionRounds,
    review,
    service,
    setCurrentAsideTab,
    setCurrentMainTab,
    setFormRef,
    submitForm,
  }
}

export const [PreProductionReviewProvider, usePreProductionReviewContext] =
  createContext<ReturnType<typeof usePreProductionReview>>({
    name: 'PreProductionReviewContext',
  })
