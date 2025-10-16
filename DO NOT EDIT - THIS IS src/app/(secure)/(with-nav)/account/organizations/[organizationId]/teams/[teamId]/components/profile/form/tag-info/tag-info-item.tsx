import type { TagCategory } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'

import { TagInfoItem as TagInfoItemV1 } from './tag-info-item-v1.tsx'
import { TagInfoItem as TagInfoItemV2 } from './tag-info-item-v2.tsx'

export type ProfileTagCategory = Extract<TagCategory, 'location' | 'language'>

export type TagInfoItemProps = {
  category: ProfileTagCategory
}

export const TagInfoItem = ({ category }: TagInfoItemProps) => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return <TagInfoItemV2 category={category} />
  }

  return <TagInfoItemV1 category={category} />
}
