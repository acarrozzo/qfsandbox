import type { TFunction } from 'i18next'

import { s } from '@mntn-dev/session'

import { getServerTranslation } from '~/utils/server/get-server-translation.ts'

import { getDashboardTabs } from './get-dashboard-tabs.ts'

export const getServerDashboardTabs = async () => {
  const session = await s.getAuthorizedSessionOrLogout()
  const { t } = await getServerTranslation('tab-names')

  const tabs = getDashboardTabs(
    session.authz.organizationType,
    t as TFunction<'tab-names'>
  )

  return tabs
}
