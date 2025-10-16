import type { RouteKey } from '@mntn-dev/app-routing'

export type RouteBreadcrumbTokens = Partial<
  Record<RouteKey, string | undefined>
>
