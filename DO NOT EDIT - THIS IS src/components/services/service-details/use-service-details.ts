'use client'

import type { TFunction } from 'i18next'
import { useCallback, useMemo, useRef } from 'react'

import { BrandNoteUpdateFormModelSchema } from '@mntn-dev/app-form-schemas'
import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { type FileId, ProjectServiceUrn } from '@mntn-dev/domain-types'
import {
  createErrorMap,
  tooSmallRule,
  useForm,
  zodResolver,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  GetProjectServiceByIdWithProjectModel,
  ProjectServiceWithAcl,
} from '@mntn-dev/project-service'
import { createContext, useToast } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { useRefetchProjectServices } from '../use-refetch-project-services.ts'

export type UseServiceDetailsProps = {
  initialService: ProjectServiceWithAcl<GetProjectServiceByIdWithProjectModel>
}

const formId = 'project-service-form'

const errorMapFactory = (
  t: TFunction<'validation'>,
  context?: Record<string, unknown>
) => createErrorMap(t, (t, ctx) => [tooSmallRule(t, ctx, 'more-info')], context)

export function useServiceDetails({ initialService }: UseServiceDetailsProps) {
  const formRef = useRef<HTMLFormElement | null>(null)

  const router = useRouter()
  const { showToast } = useToast()

  const { t } = useTranslation(['generic', 'toast'])
  const { t: tValidation } = useTranslation('validation')

  const projectServiceQuery =
    trpcReactClient.projects.getProjectServiceByIdWithProject.useQuery(
      initialService.projectServiceId,
      { initialData: initialService }
    )

  const { data: service } = projectServiceQuery

  const {
    acl: serviceAcl,
    project: { projectId, status: projectStatus },
    projectServiceId,
    serviceType,
  } = service

  const isBrandNoteRequired = useMemo(
    () => projectStatus === 'draft' && serviceType === 'custom',
    [projectStatus, serviceType]
  )

  const schema = useMemo(
    () => BrandNoteUpdateFormModelSchema(tValidation),
    [tValidation]
  )
  const note = service.brandNote || ''
  const subject = useMemo(() => t('generic:service'), [t])
  const context = useMemo(
    () => ({
      isRequired: isBrandNoteRequired,
      subject,
    }),
    [isBrandNoteRequired, subject]
  )

  const defaultValues = {
    isRequired: isBrandNoteRequired,
    note,
  }

  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema, tValidation, {
      errorMap: errorMapFactory(tValidation, context),
    }),
    context,
  })

  // Queries
  const folderUrn = ProjectServiceUrn(projectServiceId)
  const filesQuery = trpcReactClient.files.list.useQuery({
    where: { folderUrn },
  })
  const files = useMemo(() => filesQuery.data ?? [], [filesQuery.data])

  const refetchProjectServices = useRefetchProjectServices({
    projectId,
    projectServiceId,
  })

  // Mutations
  const editBrandNote =
    trpcReactClient.projects.editBrandNoteOnProjectService.useMutation()

  const handleBack = useCallback(() => {
    router.backOrPush(route('/projects/:projectId').params({ projectId }))
  }, [projectId, router])

  const onValidFormSubmit = async (data: { note: string }) => {
    if (serviceAcl.canEditBrandNote) {
      try {
        await editBrandNote.mutateAsync({
          projectServiceId,
          brandNote: data.note || null,
        })
        await refetchProjectServices()

        handleBack()
      } catch (_error) {
        showToast.error({
          title: t('toast:service.error.title'),
          body: t('toast:service.error.body'),
          dataTestId: 'service-error-toast',
          dataTrackingId: 'service-error-toast',
        })
      }
    }
  }

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

  const brandNoteSaving = useMemo(
    () => editBrandNote.isPending || editBrandNote.isSuccess,
    [editBrandNote.isPending, editBrandNote.isSuccess]
  )

  const setFormRef = useCallback((ref: HTMLFormElement | null) => {
    formRef.current = ref
  }, [])

  const submitForm = useCallback(() => {
    formRef.current?.requestSubmit()
  }, [])

  return {
    brandNoteSaving: brandNoteSaving,
    files,
    filesLoading: filesQuery.isPending,
    filesQuery,
    folderUrn,
    form,
    formId,
    noteUpdateLoading: editBrandNote.isPending,
    onBack: handleBack,
    onSelectPreviewFile,
    onValidFormSubmit,
    projectServiceId,
    projectStatus,
    service,
    setFormRef,
    submitForm,
  }
}

export const [ServiceDetailsProvider, useServiceDetailsContext] = createContext<
  ReturnType<typeof useServiceDetails>
>({
  name: 'ServiceDetailsContext',
})
