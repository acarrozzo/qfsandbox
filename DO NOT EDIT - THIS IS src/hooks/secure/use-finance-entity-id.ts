import type { FinanceEntityId } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'

type UseFinanceEntityIdProps = {
  initialData?: FinanceEntityId
}

export const useFinanceEntityId = ({
  initialData,
}: UseFinanceEntityIdProps) => {
  const {
    principal: {
      authz: { organizationId },
    },
  } = usePrincipal()

  const { data: financeEntityId } =
    trpcReactClient.organizations.getOrganizationFinanceEntityId.useQuery(
      {
        organizationId,
      },
      { initialData }
    )

  return { financeEntityId }
}
