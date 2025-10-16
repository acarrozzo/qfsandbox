'use client'

import { forwardRef } from 'react'

import type {
  BillingProfileDomainSelectModel,
  OrganizationId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Heading, Surface } from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { PartnerProgramAccessList } from '~/app/(secure)/(with-nav)/account/organizations/components/partner-program-access-list.tsx'
import { useOrganizationPartnerPrograms } from '~/app/(secure)/(with-nav)/account/organizations/hooks/use-organization-partner-programs.ts'

type OrganizationBrandPaymentsAndProgramsProps = {
  organizationId: OrganizationId
  billingProfile?: BillingProfileDomainSelectModel
}

// replaces OrganizationBrandPaymentsAndProgramsV1
export const OrganizationPartnerPrograms = forwardRef<
  HTMLDivElement,
  OrganizationBrandPaymentsAndProgramsProps
>(({ organizationId, billingProfile }, ref) => {
  const { t } = useTranslation(['organization-details'])

  assertExists(billingProfile, 'Billing profile is required')

  const { handleCheckboxChange, accessList } = useOrganizationPartnerPrograms({
    organizationId,
    financeEntityId: billingProfile.billingProfileId,
  })

  return (
    <Surface ref={ref} border padding="6">
      <Surface.Header className="p-4">
        <Heading fontSize="xl" fontWeight="bold" textColor="primary">
          {t('organization-details:internal.partner-programs.title.brand')}
        </Heading>
      </Surface.Header>

      <PartnerProgramAccessList
        accessList={accessList}
        handleCheckboxChange={handleCheckboxChange}
      />
    </Surface>
  )
})
