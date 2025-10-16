import {
  PublicTagCategories,
  type PublicTagCategory,
  PublicTagCategorySchema,
  type TagDomainQueryModel,
  type TagFilter,
  type TagId,
} from '@mntn-dev/domain-types'
import { isEmpty, omitBy } from '@mntn-dev/utilities'

export const getTagIdsFromCategorizedList = (
  tags: Partial<Record<PublicTagCategory, TagDomainQueryModel[]>> | undefined
) => {
  return tags
    ? Object.values(tags)
        .flat()
        .map(({ tagId }) => tagId)
    : []
}

export const fileOrderedTagCategories = PublicTagCategorySchema.extract([
  'industry',
  'platform',
  'skill',
]).options

export const addTag = (
  tagFilter: TagFilter,
  category: PublicTagCategory,
  tagId: TagId
) => {
  const tags = tagFilter[category]

  if (!tags) {
    return tagId
  }

  if (Array.isArray(tags)) {
    return [...tags, tagId]
  }

  return [tags, tagId]
}

export const removeTag = (
  tagFilter: TagFilter,
  category: PublicTagCategory,
  tagId: TagId
) => {
  const tags = tagFilter[category]

  if (Array.isArray(tags)) {
    return tags.filter((t) => t !== tagId)
  }

  return []
}

export const omitEmptyCategories = (
  tagList: TagFilter,
  category: PublicTagCategory,
  tagIds: TagId | TagId[]
): TagFilter => omitBy({ ...tagList, [category]: tagIds }, isEmpty)

export const updateTagFilterCategory = (
  adding: boolean,
  tagFilter: TagFilter,
  category: PublicTagCategory,
  tagId: TagId
) =>
  adding
    ? addTag(tagFilter, category, tagId)
    : removeTag(tagFilter, category, tagId)

export const updateTagFilter = (
  adding: boolean,
  tagFilter: TagFilter,
  category: PublicTagCategory,
  tagId: TagId
) => {
  return omitEmptyCategories(
    tagFilter,
    category,
    updateTagFilterCategory(adding, tagFilter, category, tagId)
  )
}

export const flattenTags = (tags: TagDomainQueryModel[] = []) => {
  return tags.flatMap((tag) =>
    PublicTagCategories.includes(tag.category as PublicTagCategory)
      ? [tag.tagId]
      : []
  )
}
