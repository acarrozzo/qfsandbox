import type { AgreementType, OrganizationType } from '@mntn-dev/domain-types'
import { first } from '@mntn-dev/utilities'
import type { NonEmptyArray } from '@mntn-dev/utility-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'

const getBiddingAgreementTypes = (
  organizationType: OrganizationType
): NonEmptyArray<AgreementType> => {
  if (organizationType === 'brand') {
    return ['client-terms', 'credit-terms']
  }

  if (organizationType === 'agency') {
    return ['maker-terms', 'maker-project-payment-terms']
  }

  return [
    'client-terms',
    'maker-terms',
    'maker-project-payment-terms',
    'credit-terms',
  ]
}

export const useBiddingAgreements = () => {
  const { principal } = usePrincipal()

  const { data: agreements = {} } =
    trpcReactClient.public.getAgreements.useQuery({
      type: getBiddingAgreementTypes(principal.authz.organizationType),
    })

  return {
    clientTerms: first(agreements['client-terms']),
    creditTerms: first(agreements['credit-terms']),
    makerTerms: first(agreements['maker-terms']),
    makerProjectPaymentTerms: first(agreements['maker-project-payment-terms']),
  }
}
