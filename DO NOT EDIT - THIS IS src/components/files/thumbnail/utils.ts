import type { FileCategory as DomainFileCategory } from '@mntn-dev/domain-types'
import { UnhandledUnionError } from '@mntn-dev/utilities'

import type { FileCategory } from './file-icon.tsx'

export const getThumbnailFileCategory = (
  domainFileCategory?: DomainFileCategory
): FileCategory => {
  if (!domainFileCategory) {
    return 'image'
  }

  switch (domainFileCategory) {
    case 'image_document':
    case 'document':
    case 'raw': {
      return 'document'
    }
    case 'video': {
      return 'video'
    }
    case 'audio': {
      return 'audio'
    }
    case 'image': {
      return 'image'
    }

    case 'archive': {
      return 'archive'
    }
    default: {
      throw new UnhandledUnionError(domainFileCategory)
    }
  }
}
