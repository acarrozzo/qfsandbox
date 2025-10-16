'use client'

import { useTranslation } from '@mntn-dev/i18n'
import { Icon } from '@mntn-dev/ui-components'

export const ErrorMessage = ({
  message,
  withIcon = true,
}: {
  message?: string
  withIcon?: boolean
}) => {
  const { t } = useTranslation('generic')

  return (
    <div className="flex gap-3 text-xl">
      {withIcon && (
        <Icon
          name="error-warning"
          size="md"
          color="negative"
          className="my-auto"
          aria-hidden="true"
        />
      )}
      <div className="text-primary-red">{message ?? t('error')}</div>
    </div>
  )
}
