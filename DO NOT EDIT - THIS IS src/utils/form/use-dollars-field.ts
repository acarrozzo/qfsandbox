import { z } from 'zod'

import type { Dollars } from '@mntn-dev/domain-types'
import type { ValidateResult } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'

import { useCurrency } from '~/utils/use-currency.ts'

export const useDollarsField = ({
  field,
  max,
}: {
  field: string
  max: Dollars
}) => {
  const { t } = useTranslation('validation')
  const { currency } = useCurrency()

  const schema = z
    .number({ message: t('dollars.number', { field }) })
    .int({ message: t('dollars.int', { field }) })
    .nonnegative({ message: t('dollars.nonnegative', { field }) })
    .max(max, {
      message: t('dollars.max', {
        field,
        maxDollars: currency(max),
      }),
    })

  const validate = (val: unknown): ValidateResult => {
    const { error } = schema.safeParse(val)

    if (error) {
      const [issue] = error.issues
      return issue?.message || t('dollars.unknown')
    }
  }

  return { schema, validate }
}
