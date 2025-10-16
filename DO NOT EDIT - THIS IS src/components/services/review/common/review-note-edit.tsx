'use client'

import { useTranslation } from '@mntn-dev/i18n'
import {
  FormField,
  type Person,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'

import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'

import { getNoteDataTestIdPrefix } from '../utils.ts'
import {
  ReviewNoteHeader,
  type ServiceNoteHeaderProps,
} from './review-note-header.tsx'

type ReviewNoteEditProps = ServiceNoteHeaderProps & {
  avatarPerson?: Person
  onChange?: (value: string) => void
}

export const ReviewNoteEdit = ({
  onChange: onChangeProp,
  subtitle,
  timestamp,
  title,
  displayMode,
}: ReviewNoteEditProps) => {
  const { form, noteUpdateLoading, projectServiceId, review, service } =
    usePreProductionReviewContext()

  const {
    control,
    formState: { errors },
  } = form

  const { field: noteField } = useEditorController({ control, name: 'note' })

  const { t } = useTranslation('edit-service')

  const showTextArea =
    review.acl.canUpdateProposal || review.acl.canUpdateFeedback

  const handleChange = (value: string) => {
    noteField.onChange(value)

    if (onChangeProp) {
      onChangeProp(value)
    }
  }

  return (
    <div className="flex-none flex flex-col gap-4 w-full overflow-hidden">
      <ReviewNoteHeader
        subtitle={subtitle}
        timestamp={timestamp}
        title={title}
        readonly={false}
        displayMode={displayMode}
      />

      {showTextArea && (
        <FormField hasError={!!errors.note} className="overflow-hidden h-full">
          <TextEditor
            ref={noteField.ref}
            className="h-80"
            dataTestId={`${getNoteDataTestIdPrefix(false)}-textarea-${projectServiceId}`}
            dataTrackingId={`${getNoteDataTestIdPrefix(false)}-textarea-${projectServiceId}`}
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
