import { z } from 'zod'

import type { ValidateResult } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'

export const useTextField = ({
  field,
  min,
  max,
}: {
  field: string
  min: number
  max: number
}) => {
  const { t } = useTranslation('validation')

  const schema = z
    .string({ message: t('text.string', { field }) })
    .min(min, { message: t('text.min', { field, count: min }) })
    .max(max, { message: t('text.max', { field, count: max }) })

  const validate = (val: unknown): ValidateResult => {
    const { error } = schema.safeParse(val)

    if (error) {
      const [issue] = error.issues
      return issue?.message || t('text.unknown')
    }
  }

  return { schema, validate }
}
