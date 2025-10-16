import type { ExtractQueryParams } from '@mntn-dev/app-routing'
import { s } from '@mntn-dev/session'

import AgencyDashboard from './agency-dashboard.tsx'
import BrandDashboard from './brand-dashboard.tsx'
import InternalDashboard from './internal-dashboard.tsx'

export default async function Page({
  searchParams = {},
}: {
  searchParams?: ExtractQueryParams<'/dashboard'>
}) {
  const {
    authz: { organizationType },
  } = await s.getAuthorizedSessionOrLogout()

  const DashboardComponent = {
    agency: AgencyDashboard,
    brand: BrandDashboard,
    internal: InternalDashboard,
  }[organizationType]

  return <DashboardComponent params={searchParams} />
}
