import { usePathname } from '@mntn-dev/app-navigation'
import {
  type AnyRoute,
  assertFindRoute,
  authorizedRoutes,
  type FindRouteAncestryOptions,
  findRouteAncestry,
  translateRouteName,
} from '@mntn-dev/app-routing'
import type { OrganizationType } from '@mntn-dev/domain-types'
import type { RoutesTFunction } from '@mntn-dev/i18n'
import { useTranslation } from '@mntn-dev/i18n'
import { Link, SkeletonText, Text } from '@mntn-dev/ui-components'
import type { AnyValue } from '@mntn-dev/utility-types'

import { useAuthorization } from '~/hooks/secure/use-authorization.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

import { useBreadcrumbs } from './breadcrumb-provider.tsx'
import type { RouteBreadcrumbTokens } from './types.ts'

const renderBreadcrumbText = ({
  route,
  breadcrumbTokens,
  t,
  organizationType,
}: {
  route: AnyRoute
  breadcrumbTokens?: RouteBreadcrumbTokens
  t: RoutesTFunction
  organizationType: OrganizationType
}) =>
  breadcrumbTokens?.[route.pattern]
    ? breadcrumbTokens[route.pattern]
    : translateRouteName({ route, t, organizationType })

export type RouteBreadcrumbsProps = {
  options?: FindRouteAncestryOptions
}

const SkeletonBreadcrumb = () => <SkeletonText textSize="sm" className="w-24" />

export const RouteBreadcrumbs = ({ options }: RouteBreadcrumbsProps) => {
  const {
    me: { organizationType },
  } = useMe()
  const path = usePathname()
  const { breadcrumbTokens } = useBreadcrumbs()
  const currentRoute = assertFindRoute(path)
  const authorization = useAuthorization()

  const { t } = useTranslation('routes')
  const routeAncestry = findRouteAncestry(currentRoute, options).filter(
    authorizedRoutes(authorization)
  )

  return [
    // Ancestry
    ...routeAncestry.map((route) => (
      <Link
        key={route.pattern}
        fontSize="sm"
        href={route
          .params(currentRoute.parseRouteParams(path) as AnyValue)
          .toRelativeUrl()}
        textColor="secondary"
        underlined={false}
        className="inline whitespace-nowrap"
      >
        {renderBreadcrumbText({
          route,
          breadcrumbTokens,
          t,
          organizationType,
        }) ?? <SkeletonBreadcrumb />}
      </Link>
    )),

    // Leaf
    currentRoute && (
      <Text
        key={currentRoute.pattern}
        fontSize="sm"
        fontWeight="bold"
        className="inline whitespace-nowrap"
      >
        {renderBreadcrumbText({
          route: currentRoute,
          breadcrumbTokens,
          t,
          organizationType,
        }) ?? <SkeletonBreadcrumb />}
      </Text>
    ),
  ]
}
