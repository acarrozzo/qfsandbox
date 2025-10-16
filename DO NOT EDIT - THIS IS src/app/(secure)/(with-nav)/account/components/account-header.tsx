'use client'

import { usePathname, useRouter } from '@mntn-dev/app-navigation'
import {
  assertFindRoute,
  findValidRouteFromAncestryWithParams,
  getRouteParam,
  route,
} from '@mntn-dev/app-routing'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  PageHeader as PageHeaderUI,
  SidebarLayoutHeaderBar,
} from '@mntn-dev/ui-components'

import { RouteBreadcrumbs } from '~/components/breadcrumbs/index.ts'
import { AllOrganizationSelect } from '~/components/organization/organization-select.tsx'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { accountBaseTestId } from '../constants.ts'

const testId = `${accountBaseTestId}-header`

const AccountHeader = () => {
  const { t } = useTranslation(['generic'])
  const router = useRouter()
  const path = usePathname()
  const currentRoute = assertFindRoute(path)
  const { hasPermission } = usePermissions()

  const handleBackClick = () => {
    router.backOrPush(route('/dashboard'))
  }

  const organizationId = getRouteParam(
    currentRoute.parseRouteParams(path),
    'organizationId'
  )

  const handleOrganizationChanged = (organizationId: OrganizationId) => {
    router.push(
      findValidRouteFromAncestryWithParams(currentRoute, { organizationId })
    )
  }

  return (
    <SidebarLayoutHeaderBar>
      <PageHeaderUI>
        <PageHeaderUI.Main>
          <PageHeaderUI.Overline>
            <PageHeaderUI.OverlineLink
              onClick={handleBackClick}
              dataTestId={`${testId}-back`}
              dataTrackingId={`${testId}-back`}
            >
              {t('generic:back')}
            </PageHeaderUI.OverlineLink>
            <PageHeaderUI.OverlineDivider />
            <PageHeaderUI.OverlineBreadcrumbs
              crumbs={RouteBreadcrumbs({
                options: {
                  includeSelf: false,
                  depth: 2,
                },
              })}
            />
          </PageHeaderUI.Overline>
        </PageHeaderUI.Main>
      </PageHeaderUI>
      {organizationId && hasPermission('customer-organization:administer') && (
        <div className="w-96">
          <AllOrganizationSelect
            onChange={handleOrganizationChanged}
            value={organizationId}
          />
        </div>
      )}
    </SidebarLayoutHeaderBar>
  )
}

export { AccountHeader }
