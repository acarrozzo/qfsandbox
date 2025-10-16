import type { Authorization } from '@mntn-dev/app-routing'
import { getPermissions } from '@mntn-dev/authorization-types'
import { useFlags } from '@mntn-dev/flags-client'

import { useMyOrganization } from './use-my-organization.ts'
import { usePrincipal } from './use-principal.ts'

export function useAuthorization(): Authorization {
  const { principal } = usePrincipal()
  const flags = useFlags()
  const { multiTeam } = useMyOrganization()

  return {
    principal,
    flags,
    multiTeam,
    permissions: getPermissions(principal.authz.privileges),
  }
}
