import type { FileDomainSelectModel } from '@mntn-dev/domain-types'

export type ViewableFile = Pick<
  FileDomainSelectModel,
  | 'additionalInfo'
  | 'category'
  | 'description'
  | 'fileId'
  | 'linkSourceFileId'
  | 'name'
  | 'size'
  | 'taggingStatus'
  | 'title'
>
