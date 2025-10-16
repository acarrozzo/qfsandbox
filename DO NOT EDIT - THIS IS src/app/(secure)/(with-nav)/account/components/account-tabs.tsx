'use client'

import { usePathname, useRouter } from '@mntn-dev/app-navigation'
import {
  type AccountPageTab,
  type AnyRoute,
  accountPageTabs,
  assertFindRoute,
  findTab,
  getRouteParam,
  hasTabAttributes,
  route,
} from '@mntn-dev/app-routing'
import { OrganizationId, type OrganizationType } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { Principal } from '@mntn-dev/session-types'
import { Button, Tabs } from '@mntn-dev/ui-components'
import { isSingleItemArray, single } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useAuthorization } from '~/hooks/secure/use-authorization.ts'
import { useDynamicOrganizationType } from '~/hooks/secure/use-dynamic-organization-type.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'

import { accountBaseTestId } from '../constants.ts'

const testId = `${accountBaseTestId}-tabs`

const tabRouteMap: Record<
  AccountPageTab,
  (options: {
    principal: Principal
    organizationType: OrganizationType
    currentRouteParams: {
      organizationId: OrganizationId | undefined
    }
  }) => AnyRoute | undefined
> = {
  profile: () => route('/account/profile'),

  users: ({ principal, currentRouteParams }) =>
    route('/account/organizations/:organizationId/users').params({
      organizationId:
        currentRouteParams.organizationId ?? principal.authz.organizationId,
    }),

  team: ({ principal }) =>
    isSingleItemArray(principal.authz.teamIds)
      ? route('/account/organizations/:organizationId/teams/:teamId').params({
          organizationId: principal.authz.organizationId,
          teamId: single(principal.authz.teamIds),
        })
      : undefined,
  teams: ({ principal, currentRouteParams }) =>
    route('/account/organizations/:organizationId/teams').params({
      organizationId:
        currentRouteParams.organizationId ?? principal.authz.organizationId,
    }),
  organization: ({ principal }) =>
    // UX Optimization - Hide the Organization tab from internal users so they're not confused by two tabs "Organization" | "Organizations" where
    // the singular is their internal organization details and the plural is the customers organizations list.
    principal.authz.organizationType !== 'internal'
      ? route('/account/organizations/:organizationId').params({
          organizationId: principal.authz.organizationId,
        })
      : undefined,

  organizations: () => route('/account/organizations'),

  billing: ({ currentRouteParams, principal, organizationType }) =>
    organizationType !== 'agency'
      ? route('/account/organizations/:organizationId/billing').params({
          organizationId:
            currentRouteParams.organizationId ?? principal.authz.organizationId,
        })
      : undefined,

  payments: ({ currentRouteParams, principal, organizationType }) =>
    organizationType !== 'brand'
      ? route('/account/organizations/:organizationId/payments').params({
          organizationId:
            currentRouteParams.organizationId ?? principal.authz.organizationId,
        })
      : undefined,
}

const AccountTabs = () => {
  const { principal } = usePrincipal()
  const path = usePathname()
  const router = useRouter()
  const currentRoute = assertFindRoute(path)

  const organizationId = getRouteParam(
    currentRoute.parseRouteParams(path),
    'organizationId'
  )

  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery(
      {
        organizationId: organizationId ?? OrganizationId(),
      },
      {
        enabled: !!organizationId,
      }
    )

  const { dynamicOrganizationType, myOrganizationType } =
    useDynamicOrganizationType({ organization })

  const { t } = useTranslation(['account', 'generic'])
  const authorization = useAuthorization()

  if (
    !(currentRoute && hasTabAttributes<AccountPageTab>(currentRoute.attributes))
  ) {
    return null
  }
  const filteredTabs = accountPageTabs.filter((accountPageTab) =>
    tabRouteMap[accountPageTab]({
      principal,
      organizationType: dynamicOrganizationType,
      currentRouteParams: {
        organizationId,
      },
    })?.isAuthorized(authorization)
  )

  const selectedTab: AccountPageTab =
    findTab(currentRoute, filteredTabs) ?? 'profile'

  const handleTabChange = (tab: AccountPageTab) => {
    const route = tabRouteMap[tab]({
      principal,
      organizationType: dynamicOrganizationType,
      currentRouteParams: {
        organizationId,
      },
    })

    if (route) {
      router.push(route)
    }
  }

  const handleLogoutClicked = () => {
    router.push(route('/api/auth/logout'))
  }

  return (
    <div className="w-full px-8 flex">
      <Tabs<AccountPageTab>
        current={selectedTab}
        onClick={handleTabChange}
        type="simple"
      >
        {filteredTabs.map((tab) => (
          <Tabs.Tab
            key={tab}
            name={t(`tabs.${tab}.${myOrganizationType}`)}
            id={tab}
            dataTestId={`${testId}-${tab}`}
            dataTrackingId={`${testId}-${tab}`}
          />
        ))}
      </Tabs>
      <div className="grow" />
      <Button
        variant="secondary"
        size="sm"
        onClick={handleLogoutClicked}
        dataTestId={`${testId}-logout`}
        dataTrackingId={`${testId}-logout`}
        readonly={false}
        className="self-center"
      >
        {t('generic:log-out')}
      </Button>
    </div>
  )
}

export { AccountTabs }
