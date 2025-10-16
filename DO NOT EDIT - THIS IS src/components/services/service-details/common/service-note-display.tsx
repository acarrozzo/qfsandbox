'use client'

import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import { useTranslation } from '@mntn-dev/i18n'
import { Avatar, type Person, RichText, Text } from '@mntn-dev/ui-components'

import { getNoteDataTestIdPrefix } from '../utils.ts'
import {
  ServiceNoteHeader,
  type ServiceNoteHeaderProps,
} from './service-note-header.tsx'

type ServiceNoteDisplayProps = ServiceNoteHeaderProps & {
  avatarPerson?: Person
  note: string
}

const ServiceNoteDisplay = ({
  avatarPerson,
  note,
  subtitle,
  timestamp,
  title,
}: ServiceNoteDisplayProps) => {
  const { t } = useTranslation('edit-service')

  return (
    <div className="flex gap-6 w-full overflow-hidden">
      {avatarPerson && (
        <Avatar>
          <Avatar.Person person={avatarPerson} image={NextImage()} />
        </Avatar>
      )}
      <div className="flex flex-col gap-4 h-full w-full pb-4">
        <ServiceNoteHeader
          subtitle={subtitle}
          timestamp={timestamp}
          title={title}
          readonly={true}
        />

        <div className="overflow-hidden w-full">
          {note ? (
            <RichText
              bounded
              value={note}
              dataTestId={`${getNoteDataTestIdPrefix(true)}-note`}
              dataTrackingId={`${getNoteDataTestIdPrefix(true)}-note`}
              className="h-full overflow-y-auto"
            />
          ) : (
            <Text textColor="tertiary">{t('no-brand-note')}</Text>
          )}
        </div>
      </div>
    </div>
  )
}

export { ServiceNoteDisplay }
