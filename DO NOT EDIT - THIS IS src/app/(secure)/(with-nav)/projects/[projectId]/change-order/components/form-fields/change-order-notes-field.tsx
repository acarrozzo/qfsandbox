'use client'

import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  FormField,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'

import type { ServiceFieldProps } from '~/app/(secure)/(with-nav)/packages/[packageId]/components/package-service/form-fields/types'

export const ChangeOrderNoteField = ({ disabled }: ServiceFieldProps) => {
  const { t } = useTranslation(['change-order', 'validation'])

  const {
    control,
    formState: { errors },
  } = useFormContext<{ notes: string }>()

  const { field } = useEditorController({
    control,
    name: 'notes',
  })

  return (
    <FormField columnSpan={6} className="w-full" hasError={!!errors.notes}>
      <FormField.Label>
        {t('change-order:service.fields.notes')}
      </FormField.Label>
      <FormField.Control>
        <TextEditor
          ref={field.ref}
          onBlur={field.onBlur}
          onChange={field.onChange}
          defaultValue={field.value}
          className="h-40"
          disabled={disabled}
        />
      </FormField.Control>
      <FormField.Error>{errors.notes?.message}</FormField.Error>
    </FormField>
  )
}
