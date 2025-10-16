import { useTranslation } from '@mntn-dev/i18n'
import {
  getThumbnailSizing,
  Icon,
  Text,
  type ThumbnailSize,
} from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

type EmptyProjectThumbnailProps = {
  canUpload?: boolean
  size: ThumbnailSize
}

export const EmptyProjectThumbnail = ({
  canUpload,
  size,
}: EmptyProjectThumbnailProps) => {
  const { t } = useTranslation('files')
  const sizing = getThumbnailSizing(size)

  return (
    <div
      className={cn(
        'h-full w-full flex flex-col items-center justify-center gap-2 rounded-lg',
        themeBorderColorMap['dashed-rounded-primary-blue']
      )}
    >
      {canUpload ? (
        <>
          <Icon name="upload" size={sizing.uploadIconSize} color="brand" />
          {size !== 'xs' && (
            <Text
              className="uppercase"
              fontSize={sizing.uploadTextSize}
              textColor="tertiary"
            >
              {t('add-project-thumbnail')}
            </Text>
          )}
        </>
      ) : (
        <Icon name="video" size={sizing.emptyThumbnailIconSize} color="brand" />
      )}
    </div>
  )
}
