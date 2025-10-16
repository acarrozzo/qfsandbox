import type { FileDomainQueryModel } from '@mntn-dev/domain-types'
import { Icon, type IconSize } from '@mntn-dev/ui-components'
import { UnhandledUnionError } from '@mntn-dev/utilities'

type Props = {
  file: Pick<FileDomainQueryModel, 'category'>
  size: IconSize
}

export const FileIcon = ({ file, size }: Props) => {
  switch (file.category) {
    case 'image_document':
    case 'document':
    case 'raw': {
      return <Icon name="file" fill="outline" size={size} color="brand" />
    }
    case 'video': {
      return <Icon name="film" fill="outline" size={size} color="brand" />
    }
    case 'audio': {
      return <Icon name="music" fill="outline" size={size} color="brand" />
    }
    case 'image': {
      return <Icon name="image" fill="outline" size={size} color="brand" />
    }

    case 'archive': {
      return <Icon name="file-zip" fill="outline" size={size} color="brand" />
    }
    default: {
      throw new UnhandledUnionError(file.category)
    }
  }
}
