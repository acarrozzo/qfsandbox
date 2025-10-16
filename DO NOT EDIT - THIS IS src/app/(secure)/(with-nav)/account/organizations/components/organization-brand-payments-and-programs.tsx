'use client'

import type {
  BillingProfileDomainSelectModel,
  OrganizationId,
} from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'

import { OrganizationBrandPaymentsAndPrograms as OrganizationBrandPaymentsAndProgramsV1 } from './organization-brand-payments-and-programs-v1.tsx'
import { OrganizationPartnerPrograms } from './organization-partner-programs.tsx'

type OrganizationBrandPaymentsAndProgramsProps = {
  organizationId: OrganizationId
  billingProfile?: BillingProfileDomainSelectModel
}

export const OrganizationBrandPaymentsAndPrograms = ({
  organizationId,
  billingProfile,
}: OrganizationBrandPaymentsAndProgramsProps) => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return (
      <OrganizationPartnerPrograms
        organizationId={organizationId}
        billingProfile={billingProfile}
      />
    )
  }
  return (
    <OrganizationBrandPaymentsAndProgramsV1
      organizationId={organizationId}
      billingProfile={billingProfile}
    />
  )
}
