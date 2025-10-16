import { Surface } from 'node_modules/@mntn-dev/ui-components/src/components/surface/surface.tsx'

import type { BillingProfileId, OrganizationId } from '@mntn-dev/domain-types'
import { forwardRef } from '@mntn-dev/ui-components'

import { BillingProfileTeamsList } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/profiles/components/billing-profile-teams-list/billing-profile-teams-list.component.tsx'

type BillingProfileControlsProps = {
  billingProfileId: BillingProfileId
  organizationId: OrganizationId
}

export const BillingProfileControls = forwardRef<
  HTMLDivElement,
  BillingProfileControlsProps
>(({ billingProfileId, organizationId }, ref) => {
  return (
    <Surface ref={ref} border padding="6">
      <Surface.Body>
        <BillingProfileTeamsList
          billingProfileId={billingProfileId}
          organizationId={organizationId}
        />
      </Surface.Body>
    </Surface>
  )
})
