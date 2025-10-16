import { useCallback } from 'react'

import type { CreditProgramKind, PackageSource } from '@mntn-dev/domain-types'

import { getCreditProgramKindByPackageSource } from '#utils/pricing/use-pricing.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'

export const useCanUserSeePackage = () => {
  const { hasPermission } = usePermissions()
  const {
    principal: {
      authz: { organizationId },
    },
  } = usePrincipal()
  const { data: partnerPrograms } =
    trpcReactClient.organizations.getOrganizationPartnerPrograms.useQuery({
      organizationId,
    })

  const canUserSeePackage = useCallback(
    ({
      packageSource,
      creditProgramKind,
    }: {
      packageSource?: PackageSource
      creditProgramKind?: CreditProgramKind
    }) => {
      if (hasPermission('project:administer')) {
        return true
      }

      const creditProgram =
        creditProgramKind ??
        (packageSource && getCreditProgramKindByPackageSource(packageSource))

      if (!creditProgram) {
        return hasPermission('package:view')
      }

      if (creditProgram === 'tiktok') {
        return false
      }

      return partnerPrograms?.find(
        (program) => program.creditProgramKind === creditProgram
      )
    },
    [hasPermission, partnerPrograms]
  )

  return { canUserSeePackage }
}
