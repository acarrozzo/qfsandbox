'use client'

import { FormattedDate } from '@mntn-dev/app-ui-components'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag, Text } from '@mntn-dev/ui-components'
import { themeTextColorMap } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'

import {
  getNoteDataTestIdPrefix,
  isMakerUpdate,
  isReadyForReview,
} from '../utils.ts'

type ServiceNoteHeaderProps = {
  readonly?: boolean
  subtitle?: string
  timestamp?: Date
  title: string
  displayMode?: 'main' | 'history'
}

const ServiceNoteTitleTags = ({
  readonly,
  displayMode,
}: {
  readonly: boolean
  displayMode?: 'main' | 'history'
}) => {
  const { t } = useTranslation('edit-service')

  const { review } = usePreProductionReviewContext()

  if (!readonly && isMakerUpdate(review) && displayMode === 'main') {
    return (
      <Tag type="error" variant="secondary">
        {t('update')}
      </Tag>
    )
  }

  if (readonly && isReadyForReview(review) && displayMode === 'main') {
    return (
      <Tag type="error" variant="secondary">
        {t('ready-for-review')}
      </Tag>
    )
  }

  return null
}

const ServiceNoteTitleTimestamp = ({ timestamp }: { timestamp: Date }) => {
  return (
    <time
      dateTime={timestamp.toLocaleDateString()}
      className={cn(
        'text-sm font-medium uppercase',
        themeTextColorMap.tertiary
      )}
    >
      {timestamp ? (
        <FormattedDate date={timestamp} format="medium-date-time" />
      ) : undefined}
    </time>
  )
}

const ReviewNoteHeader = ({
  readonly = false,
  subtitle,
  timestamp,
  title,
  displayMode,
}: ServiceNoteHeaderProps) => (
  <div className="flex items-center gap-2 justify-between w-full">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Text
          fontSize="lg"
          textColor="primary"
          fontWeight="bold"
          dataTestId={`${getNoteDataTestIdPrefix(readonly)}-title`}
          dataTrackingId={`${getNoteDataTestIdPrefix(readonly)}-title`}
        >
          {title}
        </Text>
        <ServiceNoteTitleTags readonly={readonly} displayMode={displayMode} />
      </div>
      {subtitle && (
        <Text
          fontSize="sm"
          textColor="tertiary"
          dataTestId={`${getNoteDataTestIdPrefix(readonly)}-subtitle`}
          dataTrackingId={`${getNoteDataTestIdPrefix(readonly)}-subtitle`}
        >
          {subtitle}
        </Text>
      )}
    </div>
    {readonly && timestamp && (
      <ServiceNoteTitleTimestamp timestamp={timestamp} />
    )}
  </div>
)

export { ReviewNoteHeader, type ServiceNoteHeaderProps }
