import { useMemo } from 'react'

import type { OrganizationDomainQueryModel } from '@mntn-dev/domain-types'
import { defined } from '@mntn-dev/utilities'

export const useFailedCharges = ({
  organization,
}: {
  organization?: OrganizationDomainQueryModel
}) =>
  useMemo(
    () =>
      defined(
        organization?.billingProfiles?.flatMap(
          (billingProfile) => billingProfile.failedCharges
        ) ?? []
      ),
    [organization?.billingProfiles]
  )
