import { isMultiTeam } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useMyOrganization = () => {
  const [me] = trpcReactClient.users.getMe.useSuspenseQuery(undefined)

  const { organizationId } = me

  const [organization] =
    trpcReactClient.organizations.getOrganization.useSuspenseQuery({
      organizationId,
    })

  return {
    organization,
    organizationId: organization.organizationId,
    organizationType: organization.organizationType,
    multiTeam: isMultiTeam(organization),
  }
}
