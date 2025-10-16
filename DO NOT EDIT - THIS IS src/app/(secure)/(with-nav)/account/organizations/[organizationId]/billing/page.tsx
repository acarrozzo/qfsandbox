import { notFound } from '@mntn-dev/app-navigation'
import type { OrganizationId } from '@mntn-dev/domain-types'
import type {
  GetAgencyTransactionsInput,
  GetBrandTransactionsInput,
  GetTransactionsInput,
} from '@mntn-dev/finance-service/types'
import { logger } from '@mntn-dev/logger'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'
import { SidebarLayoutContent } from '@mntn-dev/ui-components'
import { endOfToday, startOfYear } from '@mntn-dev/utilities'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { OrganizationBilling } from './components/organization-billing.tsx'

export default async function Page({
  params: { organizationId },
}: Readonly<{ params: { organizationId: OrganizationId } }>) {
  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to view billing page for organization ${organizationId}`
    )
    notFound()
  }

  const organization = await trpcServerSideClient.organizations.getOrganization(
    { organizationId }
  )
  const financeEntityId =
    await trpcServerSideClient.organizations.getOrganizationFinanceEntityId({
      organizationId,
    })

  const startDate = startOfYear(new Date())
  const endDate = endOfToday()
  const pageSize = 5

  let input: GetTransactionsInput | undefined

  if (organization.organizationType === 'agency') {
    const agencyInput: GetAgencyTransactionsInput = {
      organizationId,
      transactionType: organization.organizationType,
      startDate: startDate,
      endDate: endDate,
      paging: {
        pageSize,
      },
    }
    input = agencyInput
  } else if (organization.organizationType === 'brand') {
    const brandInput: GetBrandTransactionsInput = {
      financeEntityId,
      transactionType: organization.organizationType,
      startDate: startDate,
      endDate: endDate,
      paging: {
        pageSize,
      },
    }
    input = brandInput
  }

  await Promise.all(
    [
      trpcServerSideClient.organizations.getOrganization.prefetch({
        organizationId,
      }),

      trpcServerSideClient.financeCoordinator.getBillingProfile.prefetch({
        billingProfileId: financeEntityId,
      }),

      trpcServerSideClient.financeCoordinator.getBillingProfileDefaultBillingServiceMethodInfo.prefetch(
        {
          billingProfileId: financeEntityId,
        }
      ),

      trpcServerSideClient.financeCoordinator.listBillingProfileBillingServiceMethods.prefetch(
        {
          billingProfileId: financeEntityId,
        }
      ),

      trpcServerSideClient.financeCoordinator.getBillingProfileTeams.prefetch({
        billingProfileId: financeEntityId,
      }),

      input && trpcServerSideClient.finance.getTransactions.prefetch(input),
    ].filter(Boolean)
  )

  return (
    <HydrateClient>
      <SidebarLayoutContent className="max-w-full">
        <OrganizationBilling
          organizationId={organizationId}
          billingProfileId={financeEntityId}
          initialStartDate={startDate}
          initialEndDate={endDate}
          pageSize={pageSize}
        />
      </SidebarLayoutContent>
    </HydrateClient>
  )
}
