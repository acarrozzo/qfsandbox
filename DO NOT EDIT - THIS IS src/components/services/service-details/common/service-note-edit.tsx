'use client'

import { useController } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField, type Person, TextEditor } from '@mntn-dev/ui-components'

import { ServiceNoteCustomAlert } from '#components/services/service-details/common/service-note-custom-alert.tsx'

import { useServiceDetailsContext } from '../use-service-details.ts'
import { getNoteDataTestIdPrefix } from '../utils.ts'
import {
  ServiceNoteHeader,
  type ServiceNoteHeaderProps,
} from './service-note-header.tsx'

type ServiceNoteEditProps = ServiceNoteHeaderProps & {
  avatarPerson?: Person
  onChange?: (value: string) => void
  isCustomService?: boolean
}

export const ServiceNoteEdit = ({
  onChange: onChangeProp,
  subtitle,
  timestamp,
  title,
  isCustomService = false,
}: ServiceNoteEditProps) => {
  const { form, noteUpdateLoading, service } = useServiceDetailsContext()

  const {
    control,
    formState: { errors },
  } = form

  const { field: noteField } = useController({
    control,
    name: 'note',
  })

  const { t } = useTranslation('edit-service')

  const showTextArea = service.acl.canEditBrandNote

  const handleChange = (value: string) => {
    noteField.onChange(value)

    if (onChangeProp) {
      onChangeProp(value)
    }
  }

  return (
    <div className="flex-none flex flex-col gap-4 w-full overflow-hidden">
      <ServiceNoteHeader
        subtitle={subtitle}
        timestamp={timestamp}
        title={title}
        readonly={false}
      />

      {isCustomService && <ServiceNoteCustomAlert />}

      {showTextArea && (
        <FormField hasError={!!errors.note} className="overflow-hidden h-full">
          <TextEditor
            ref={noteField.ref}
            className="h-100"
            dataTestId={`${getNoteDataTestIdPrefix(false)}-textarea-${service.projectServiceId}`}
            dataTrackingId={`${getNoteDataTestIdPrefix(false)}-textarea-${service.projectServiceId}`}
            disabled={noteUpdateLoading}
            placeholder={t('note-form-placeholder-edit', {
              service: service.name,
            })}
            onBlur={noteField.onBlur}
            defaultValue={noteField.value}
            onChange={handleChange}
          />
          <FormField.Error>{errors.note?.message}</FormField.Error>
        </FormField>
      )}
    </div>
  )
}
