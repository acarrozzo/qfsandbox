'use client'

import { useTagCategories } from '@mntn-dev/app-common'
import {
  PublicTagCategories,
  type PublicTagCategory,
  type TagId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Chip,
  Chips,
  DataList,
  getChildTestIds,
  type TestIds,
  Text,
} from '@mntn-dev/ui-components'
import { isNilOrEmptyArray } from '@mntn-dev/utilities'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'

export const VideoTagFilters = ({ dataTestId, dataTrackingId }: TestIds) => (
  <DataList variant="inverted" rowGap="12">
    {PublicTagCategories.map((category) => (
      <VideoTagFilterItem
        key={category}
        category={category}
        dataTestId={dataTestId}
        dataTrackingId={dataTrackingId}
      />
    ))}
  </DataList>
)

const VideoTagFilterItem = ({
  category,
  dataTestId,
  dataTrackingId,
}: { category: PublicTagCategory } & TestIds) => {
  const { translations } = useTagCategories('public')
  const { allExampleTags, onFilterChange, tagFilter } =
    useTeamProfileEditorContext()
  const { t } = useTranslation('team-profile')
  const categoryTags = allExampleTags[category]

  const handleTagSelect = (tagId: TagId) => (selected: boolean) => {
    onFilterChange(selected, tagId)
  }

  return (
    <DataList.Item className="gap-4">
      <DataList.Title>{translations.data[category].plural}</DataList.Title>
      <DataList.Description>
        {isNilOrEmptyArray(categoryTags) ? (
          <Text>{t('no-tags')}</Text>
        ) : (
          <Chips className="overflow-hidden flex-wrap">
            {categoryTags.map((tag) => (
              <Chip
                key={tag.tagId}
                selectable
                selected={tagFilter?.includes(tag.tagId) ?? false}
                onSelected={handleTagSelect(tag.tagId)}
                variant="rounded-square"
                {...getChildTestIds(
                  { dataTestId, dataTrackingId },
                  'tag-filter',
                  category,
                  tag.key
                )}
              >
                {tag.value}
              </Chip>
            ))}
          </Chips>
        )}
      </DataList.Description>
    </DataList.Item>
  )
}
