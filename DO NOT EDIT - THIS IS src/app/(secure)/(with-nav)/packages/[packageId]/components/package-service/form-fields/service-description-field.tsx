'use client'

import type { ServiceDomainSelectModel } from '@mntn-dev/domain-types'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  FormField,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'

import type { ServiceFieldProps } from './types.ts'

export const ServiceDescriptionField = ({ disabled }: ServiceFieldProps) => {
  const { t } = useTranslation(['service-details', 'validation'])

  const {
    control,
    formState: { errors },
  } = useFormContext<Pick<ServiceDomainSelectModel, 'description'>>()

  const { field } = useEditorController({
    control,
    name: 'description',
  })

  return (
    <FormField
      columnSpan={6}
      className="w-full"
      hasError={!!errors.description}
    >
      <FormField.Label>
        {t('service-details:field.description')}
      </FormField.Label>
      <FormField.Control>
        <TextEditor
          ref={field.ref}
          onBlur={field.onBlur}
          onChange={field.onChange}
          defaultValue={field.value}
          placeholder={t('service-details:field.description')}
          className="h-40 w-full"
          disabled={disabled}
        />
      </FormField.Control>
      <FormField.Error>{errors.description?.message}</FormField.Error>
    </FormField>
  )
}
