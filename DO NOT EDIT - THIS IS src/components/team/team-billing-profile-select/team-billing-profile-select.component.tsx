'use client'

import { forwardRef } from 'react'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { Icon, Select, type SelectProps } from '@mntn-dev/ui-components'

import {
  type UseTeamBillingProfileSelectProps,
  useTeamBillingProfileSelect,
} from './team-billing-profile-select.hook.ts'

type TeamBillingProfileSelectProps = Omit<
  SelectProps<BillingProfileId>,
  'placeholder' | 'deselectable' | 'options' | 'value' | 'onChange'
> &
  UseTeamBillingProfileSelectProps

// This component wraps the Select component with functionality for team billing profiles
export const TeamBillingProfileSelect = forwardRef<
  HTMLDivElement,
  TeamBillingProfileSelectProps
>(({ teamId, onChange, ...props }, ref) => {
  const { t, value, options, handleChange } = useTeamBillingProfileSelect({
    teamId,
    onChange,
  })

  return (
    <Select
      {...props}
      iconLeft={<Icon name="bank" fill="solid" size="md" color="brand" />}
      searchable={false}
      deselectable={false}
      ref={ref}
      placeholder={t('select.billingProfile.placeholder')}
      value={value}
      onChange={handleChange}
      options={options}
    />
  )
})

// display name is used in react devtools
TeamBillingProfileSelect.displayName = 'TeamBillingProfileSelect'
