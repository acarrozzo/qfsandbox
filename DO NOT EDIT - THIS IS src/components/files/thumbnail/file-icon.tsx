import { Icon, type IconSize } from '@mntn-dev/ui-components'
import { UnhandledUnionError } from '@mntn-dev/utilities'

export type FileCategory = 'document' | 'image' | 'video' | 'audio' | 'archive'

export type FileIconProps = {
  fileCategory: FileCategory
  size: IconSize
}

export const FileIcon = ({ fileCategory, size }: FileIconProps) => {
  switch (fileCategory) {
    case 'document': {
      return <Icon name="file" size={size} color="brand" />
    }
    case 'video': {
      return <Icon name="film" size={size} color="brand" />
    }
    case 'audio': {
      return <Icon name="music" size={size} color="brand" />
    }
    case 'image': {
      return <Icon name="image" size={size} color="brand" />
    }

    case 'archive': {
      return <Icon name="file-zip" size={size} color="brand" />
    }
    default: {
      throw new UnhandledUnionError(fileCategory)
    }
  }
}
