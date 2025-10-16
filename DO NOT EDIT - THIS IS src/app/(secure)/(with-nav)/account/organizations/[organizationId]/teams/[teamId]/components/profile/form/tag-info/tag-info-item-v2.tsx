import { Fragment, useMemo } from 'react'

import { TagFormField } from '@mntn-dev/app-ui-components'
import type { TagCategory } from '@mntn-dev/domain-types'
import { useController } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  getChildTestProps,
  Icon,
  type IconName,
  type MultiselectOptionItem,
  Text,
} from '@mntn-dev/ui-components'
import { assert, isNonEmptyArray } from '@mntn-dev/utilities'

import { useTeamProfileEditorContext } from '../../../../hooks/use-team-profile-editor.ts'

export type ProfileTagCategory = Extract<TagCategory, 'location' | 'language'>

const tagCategoryIconMap: Record<ProfileTagCategory, IconName> = {
  location: 'map-2',
  language: 'chat',
}

export type TagInfoItemProps = {
  category: ProfileTagCategory
}

export const TagInfoItem = ({ category }: TagInfoItemProps) => {
  const { t } = useTranslation(['team-profile'])

  const {
    allTags,
    editing,
    form: { control },
    dataTestId,
    dataTrackingId,
    savingAgency,
  } = useTeamProfileEditorContext()

  const { field, fieldState } = useController({
    control,
    name: `tags.${category}`,
  })

  const selectedItems = useMemo(
    () => field.value?.map((tag) => ({ id: tag.tagId, name: tag.value })) ?? [],
    [field.value]
  )

  const handleTagsChange = (items: MultiselectOptionItem[]) => {
    const newTagsForCategory = items.map(({ id }) => {
      const matchingTag = allTags?.[category]?.find((tag) => tag.tagId === id)
      assert(
        matchingTag,
        `Tag with id ${id} not found for category ${category}`
      )
      return matchingTag
    })

    field.onChange(newTagsForCategory)
  }

  const tagCategoryGridAreaMap: Record<ProfileTagCategory, string> = {
    location: '[grid-area:location]',
    language: '[grid-area:language]',
  }

  return (
    <div className={tagCategoryGridAreaMap[category]}>
      {editing ? (
        <div className="w-100">
          <TagFormField
            {...field}
            disabled={savingAgency}
            hasError={fieldState.invalid}
            hideLabel={true}
            errorMessage={fieldState.error?.message}
            allTags={allTags}
            category={category}
            dataTestId={`${dataTestId}-${category}-tag-editor`}
            dataTrackingId={`${dataTrackingId}-${category}-tag-editor`}
            label={t(`team-profile:form.${category}.label`)}
            listLocation="above"
            placeholder={t(`team-profile:form.${category}.placeholder`)}
            selectedItems={selectedItems}
            onChange={handleTagsChange}
          />
        </div>
      ) : isNonEmptyArray(field.value) ? (
        <div
          className="flex flex-wrap justify-center items-center gap-2"
          {...getChildTestProps(
            { dataTestId, dataTrackingId },
            `${category}-tag-list`
          )}
        >
          <Icon name={tagCategoryIconMap[category]} size="lg" color="brand" />
          {field.value.map((tag, index) => (
            <Fragment key={tag.tagId}>
              <Text>{tag.value}</Text>
              {index < (field?.value?.length ?? 0) - 1 && (
                <Text textColor="secondary">•</Text>
              )}
            </Fragment>
          ))}
        </div>
      ) : null}
    </div>
  )
}
