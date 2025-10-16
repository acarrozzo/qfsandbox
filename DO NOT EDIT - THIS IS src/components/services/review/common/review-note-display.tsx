'use client'

import { userToPerson } from '@mntn-dev/app-common'
import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import { useTranslation } from '@mntn-dev/i18n'
import { Avatar, type Person, RichText, Text } from '@mntn-dev/ui-components'

import { getAvatarUrl } from '#components/avatar/helper.ts'

import { getNoteDataTestIdPrefix } from '../utils.ts'
import {
  ReviewNoteHeader,
  type ServiceNoteHeaderProps,
} from './review-note-header.tsx'

type ServiceNoteDisplayProps = ServiceNoteHeaderProps & {
  avatarPerson?: Person
  note: string
}

const ReviewNoteDisplay = ({
  avatarPerson,
  note,
  subtitle,
  timestamp,
  title,
  displayMode = 'main',
}: ServiceNoteDisplayProps) => {
  const { t } = useTranslation('edit-service')

  return (
    <div className="flex gap-6 w-full h-full overflow-hidden">
      {avatarPerson && (
        <Avatar>
          <Avatar.Person
            person={userToPerson(avatarPerson, getAvatarUrl)}
            image={NextImage({ unoptimized: true })}
          />
        </Avatar>
      )}
      <div className="flex flex-col gap-4 h-full w-full pb-4">
        <ReviewNoteHeader
          subtitle={subtitle}
          timestamp={timestamp}
          title={title}
          readonly={true}
          displayMode={displayMode}
        />

        <div className="overflow-hidden w-full">
          {note ? (
            <RichText
              dataTestId={`${getNoteDataTestIdPrefix(true)}-note`}
              dataTrackingId={`${getNoteDataTestIdPrefix(true)}-note`}
              bounded
              value={note}
              className="h-full overflow-y-auto"
            />
          ) : (
            <Text
              textColor="tertiary"
              dataTestId={`${getNoteDataTestIdPrefix(true)}-note`}
              dataTrackingId={`${getNoteDataTestIdPrefix(true)}-note`}
            >
              {t('no-brand-note')}
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

export { ReviewNoteDisplay }
