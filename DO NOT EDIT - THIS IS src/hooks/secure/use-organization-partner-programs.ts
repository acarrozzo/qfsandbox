'use client'

import { useMemo } from 'react'

import { CreditProgramKindSchema } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { useCanUserSeePackage } from './use-can-user-see-package.ts'
import { usePermissions } from './use-permissions.ts'
import { usePrincipal } from './use-principal.ts'

export function useOrganizationPartnerPrograms() {
  const { principal } = usePrincipal()
  const { hasPermission } = usePermissions()
  const { canUserSeePackage } = useCanUserSeePackage()

  const [partnerPrograms] =
    trpcReactClient.organizations.getOrganizationPartnerPrograms.useSuspenseQuery(
      {
        organizationId: principal.authz.organizationId,
      }
    )

  const allowedProjectCreditKinds = useMemo(() => {
    if (hasPermission('project:administer')) {
      return CreditProgramKindSchema.options
    }

    return (
      partnerPrograms
        ?.filter((program) =>
          canUserSeePackage({ creditProgramKind: program.creditProgramKind })
        )
        .map((program) => program.creditProgramKind) ?? []
    )
  }, [canUserSeePackage, hasPermission, partnerPrograms])

  return {
    allowedProjectCreditKinds,
    partnerPrograms,
  }
}
