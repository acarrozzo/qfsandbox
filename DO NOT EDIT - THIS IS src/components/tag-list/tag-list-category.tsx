'use client'

import type { TagCategory, TagDomainQueryModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Chip,
  type ChipProps,
  Chips,
  DataList,
  Text,
} from '@mntn-dev/ui-components'

type TagListCategoryProps = {
  category: TagCategory
  label?: string
  tags: TagDomainQueryModel[] | undefined
  showEmpty?: boolean
  showTitle?: boolean
  placeholder?: string
  variant?: ChipProps['variant']
}

const TagListCategory = ({
  category,
  label,
  tags = [],
  showEmpty = false,
  showTitle = true,
  placeholder,
  variant,
}: TagListCategoryProps) => {
  const { t } = useTranslation(['tags'])
  return tags.length > 0 || showEmpty ? (
    <DataList.Item>
      {showTitle && (
        <DataList.Title>
          {label ??
            t(`category-labels.${category}`, {
              count: tags.length,
              ns: 'tags',
            })}
        </DataList.Title>
      )}
      <DataList.Description>
        {tags.length > 0 ? (
          <Chips className="flex-wrap">
            {tags.map((tag) => (
              <Chip key={tag.tagId} title={tag.value} variant={variant}>
                {tag.value}
              </Chip>
            ))}
          </Chips>
        ) : (
          <Text fontSize="sm" textColor="tertiary">
            {placeholder || t('none', { ns: 'tags' })}
          </Text>
        )}
      </DataList.Description>
    </DataList.Item>
  ) : null
}

export { TagListCategory }
