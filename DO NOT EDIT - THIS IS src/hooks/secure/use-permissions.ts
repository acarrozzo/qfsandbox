import { useMemo } from 'react'

import {
  getPermissions,
  hasPermission,
  type Permission,
} from '@mntn-dev/authorization-types'

import { usePrincipal } from './use-principal.ts'

function usePermissions() {
  const { principal } = usePrincipal()

  const permissions = useMemo(
    () => ({
      ...getPermissions(principal.authz.privileges),
      hasPermission: (permission: Permission) =>
        hasPermission(principal.authz, permission),
    }),
    [principal]
  )

  return permissions
}

type HasPermission = (permission: Permission) => boolean

export { usePermissions, type HasPermission }
