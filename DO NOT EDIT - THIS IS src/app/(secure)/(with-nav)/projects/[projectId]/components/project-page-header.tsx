import type { ChangeEvent } from 'react'

import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { useController, useFormContext } from '@mntn-dev/forms'
import { Editable, FormField, PageHeader } from '@mntn-dev/ui-components'

import { useInitialProjectQueryData } from '#projects/providers/project-initial-data-provider.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client'
import { ProjectOverline } from '~/components/projects/project-overline.tsx'
import { useRefetchProject } from '~/components/projects/use-refetch-project.ts'

import { ProjectPageHeaderControls } from './project-details/project-page-header-controls.tsx'

type Props = {
  isEditing: boolean
  onToggleEditing: () => void
}

export const ProjectPageHeader = ({ isEditing, onToggleEditing }: Props) => {
  const { control, trigger } = useFormContext<ProjectDetailsUpdateFormModel>()
  const router = useRouter()

  const {
    field, // why is this undefined?
    fieldState: { invalid },
  } = useController({
    control,
    name: 'name',
  })

  const initialData = useInitialProjectQueryData()
  const projectId = initialData.project.projectId
  const projectQuery = trpcReactClient.projects.get.useQuery(projectId, {
    initialData: { project: initialData.project },
  })

  const { project } = projectQuery.data

  const canEdit = project.acl.canEditProject

  const update = trpcReactClient.projects.update.useMutation()
  const refetchProject = useRefetchProject()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    field.onChange(event.target.value)
  }

  const handleUpdate = async (value: string) => {
    const isValid = await trigger('name')

    if (isValid) {
      const updatedProject = await update.mutateAsync({
        projectId,
        updates: {
          name: value,
        },
      })

      await refetchProject(updatedProject)
    }
  }

  return (
    <PageHeader dataTestId="project-details-page-header">
      <PageHeader.Main>
        <PageHeader.Overline>
          <ProjectOverline
            projectStatus={project.status}
            packageName={project.inherited.package.name}
            packageSource={project.package?.packageSource}
            onBack={() => router.backOrPush(route('/dashboard'))}
            projectId={projectId}
          />
        </PageHeader.Overline>
        <FormField hasError={invalid} className="w-full">
          <Editable
            initialValue={field.value}
            placeholder={project.inherited.package.name}
            readOnly={!canEdit}
            onChange={handleChange}
            onUpdate={handleUpdate}
            ref={field.ref}
            onBlur={field.onBlur}
            dataTestId="project-name-editable"
            className="header-title font-heading"
          />
        </FormField>
      </PageHeader.Main>

      <ProjectPageHeaderControls {...{ isEditing, project, onToggleEditing }} />
    </PageHeader>
  )
}
