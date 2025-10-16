'use client'

import {
  TagCategories,
  type TagCategory,
  type TagDomainQueryModel,
  toTagsByCategoryMap,
} from '@mntn-dev/domain-types'
import { DataList, type DataListProps } from '@mntn-dev/ui-components'
import type { ThemeGap } from '@mntn-dev/ui-theme'

import { TagListCategory } from './tag-list-category.tsx'

export type TagListProps = Pick<
  DataListProps,
  'columnCount' | keyof ThemeGap
> & {
  tags?: TagDomainQueryModel[]
  categories?: TagCategory[]
  showEmpty?: boolean
}

const TagList = ({
  tags = [],
  categories = TagCategories,
  showEmpty,
  ...dataListProps
}: TagListProps) => {
  const tagsByCategory = toTagsByCategoryMap(tags)

  return (
    <DataList {...dataListProps} fontSize="sm">
      {categories.map((category) => (
        <TagListCategory
          key={category}
          category={category}
          tags={tagsByCategory[category]}
          showEmpty={showEmpty}
          showTitle={categories.length > 1}
        />
      ))}
    </DataList>
  )
}

export { TagList }
