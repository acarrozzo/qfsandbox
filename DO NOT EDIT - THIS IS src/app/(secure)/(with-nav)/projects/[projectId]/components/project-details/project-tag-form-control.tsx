import { useMemo } from 'react'

import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import { TagFormField } from '@mntn-dev/app-ui-components/tag-form-field'
import type { TagsByCategoryMap } from '@mntn-dev/domain-types'
import { useController, useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import type { MultiselectOptionItem } from '@mntn-dev/ui-components'
import { assert } from '@mntn-dev/utilities'

import { useDebouncedUpdateProject } from './hooks/use-debounced-update-project.ts'

type EditableProjectTagCategory = 'language' | 'location'

type Props = {
  category: EditableProjectTagCategory
  project: ProjectWithAcl
  discoveredTags: TagsByCategoryMap
}

export const ProjectTagFormControl = ({
  category,
  project,
  discoveredTags,
}: Props) => {
  const { projectId } = project
  const { t } = useTranslation(['project-form'])

  const { control, getValues, trigger } =
    useFormContext<ProjectDetailsUpdateFormModel>()

  const { field, fieldState } = useController({
    name: `tags.${category}`,
    control,
  })

  /**
   * Debounce the update to avoid rapid-tag changes clobbering each other.
   * We cannot do this at the top-level update mutation (project-page-content) because only a partial of the form is sent in each update and we could miss some updates.
   */
  const { debouncedUpdate, isError, isPending } =
    useDebouncedUpdateProject(projectId)

  const handleTagsChange = async (items: MultiselectOptionItem[]) => {
    const newTagsForCategory = items.map(({ id }) => {
      const matchingTag = discoveredTags[category]?.find((t) => t.tagId === id)
      assert(
        matchingTag,
        `Tag with id ${id} not found for category ${category}`
      )
      return matchingTag
    })

    field.onChange(newTagsForCategory)

    await trigger(field.name)
  }

  const handleTagFieldClosed = async () => {
    const isValid = await trigger(field.name)

    if (isValid && fieldState.isDirty) {
      debouncedUpdate({
        tags: {
          ...getValues('tags'),
          [category]: field.value,
        },
      })
    }
  }

  const selectedItems = useMemo(
    () => field.value?.map((tag) => ({ id: tag.tagId, name: tag.value })) ?? [],
    [field.value]
  )

  return (
    <TagFormField
      {...field}
      disabled={isPending}
      hasError={fieldState.invalid || isError}
      errorMessage={fieldState.error?.message}
      allTags={discoveredTags}
      category={category}
      columnSpan={3}
      dataTestId="project"
      dataTrackingId="project"
      label={t(`project-form:${category}.label`)}
      listLocation="inside"
      placeholder={t(`project-form:${category}.placeholder`)}
      selectedItems={selectedItems}
      singleLine
      onChange={handleTagsChange}
      onClose={handleTagFieldClosed}
    />
  )
}
