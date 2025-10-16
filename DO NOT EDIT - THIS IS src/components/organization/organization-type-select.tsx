'use client'

import { forwardRef } from 'react'

import { CustomerOrganizationTypes } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Select, type SelectProps } from '@mntn-dev/ui-components'

type OrganizationTypeSelectProps = Omit<SelectProps, 'deselectable' | 'options'>

export const OrganizationTypeSelect = forwardRef<
  HTMLDivElement,
  OrganizationTypeSelectProps
>((props, ref) => {
  const { disabled } = props
  const { t } = useTranslation('organizations')

  return (
    <Select
      {...props}
      ref={ref}
      disabled={disabled}
      deselectable={false}
      searchable={false}
      options={CustomerOrganizationTypes.map((organizationType) => ({
        value: organizationType,
        label: t(`organizationType.${organizationType}`),
      }))}
    />
  )
})
