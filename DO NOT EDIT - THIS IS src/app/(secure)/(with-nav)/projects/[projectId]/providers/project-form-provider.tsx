'use client'

import type { TFunction } from 'i18next'
import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { defaultProjectTagCategoryMap } from '@mntn-dev/app-common'
import {
  type ProjectDetailsUpdateFormModel,
  ProjectDetailsUpdateFormModelSchema,
} from '@mntn-dev/app-form-schemas'
import { toTagsByCategoryMap } from '@mntn-dev/domain-types'
import {
  createGetFieldLabelFactory,
  FormProvider,
  useForm,
  zodResolver,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'

import { useInitialProjectQueryData } from '#projects/providers/project-initial-data-provider.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

type ProjectFormProviderProps = Readonly<{ children: ReactNode }>

const getProjectFormFieldLabel = (t: TFunction<'validation'>) =>
  createGetFieldLabelFactory(
    ProjectDetailsUpdateFormModelSchema(t).innerType(),
    'project-form'
  )

export const ProjectFormProvider = ({ children }: ProjectFormProviderProps) => {
  const initialData = useInitialProjectQueryData()
  const projectId = initialData.project.projectId
  const projectQuery = trpcReactClient.projects.get.useQuery(projectId, {
    initialData: { project: initialData.project },
  })

  const { t } = useTranslation('validation')

  const { project } = projectQuery.data

  const values: ProjectDetailsUpdateFormModel = useMemo(() => {
    return {
      ...project,
      name: project.name,
      description: project.description,
      tags: {
        ...defaultProjectTagCategoryMap,
        ...toTagsByCategoryMap(project.tags),
      },
    }
  }, [project])

  const methods = useForm({
    defaultValues: values,
    values,
    mode: 'onSubmit',
    resolver: zodResolver(
      ProjectDetailsUpdateFormModelSchema(t),
      t,
      undefined,
      {
        fieldLabelConfig: {
          getFieldLabel: getProjectFormFieldLabel(t)(t),
        },
      }
    ),
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}
