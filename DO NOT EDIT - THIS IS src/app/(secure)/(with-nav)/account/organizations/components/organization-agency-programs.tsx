'use client'

import { forwardRef } from 'react'

import type { FinanceEntityId, OrganizationId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Heading, Surface } from '@mntn-dev/ui-components'

import { useOrganizationPartnerPrograms } from '~/app/(secure)/(with-nav)/account/organizations/hooks/use-organization-partner-programs.ts'

import { PartnerProgramApproval } from './partner-program-approval.tsx'

type OrganizationAgencyProgramsProps = {
  organizationId: OrganizationId
  financeEntityId: FinanceEntityId
}

export const OrganizationAgencyPrograms = forwardRef<
  HTMLDivElement,
  OrganizationAgencyProgramsProps
>(({ organizationId, financeEntityId }, ref) => {
  const { t } = useTranslation(['organization-details'])
  const { handleCheckboxChange, accessList } = useOrganizationPartnerPrograms({
    organizationId,
    financeEntityId,
  })

  return (
    <Surface ref={ref} border padding="6">
      <Surface.Header className="p-4">
        <Heading fontSize="xl" fontWeight="bold" textColor="primary">
          {t('organization-details:internal.partner-programs.title.agency')}
        </Heading>
      </Surface.Header>
      <PartnerProgramApproval
        accessList={accessList}
        handleCheckboxChange={handleCheckboxChange}
      />
    </Surface>
  )
})
