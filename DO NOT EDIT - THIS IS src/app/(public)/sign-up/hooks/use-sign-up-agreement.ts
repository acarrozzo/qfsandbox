'use client'

import { useMemo } from 'react'

import type {
  AgreementDomainQueryModel,
  CustomerOrganizationType,
} from '@mntn-dev/domain-types'
import { first } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export function useSignUpAgreement({
  organizationType,
}: {
  organizationType: CustomerOrganizationType
}) {
  const [agreements] = trpcReactClient.public.getAgreements.useSuspenseQuery({
    type: ['client-terms', 'maker-terms'],
  })

  const clientTermsAgreement = first(agreements['client-terms'])
  const makerTermsAgreement = first(agreements['maker-terms'])

  if (!(clientTermsAgreement && makerTermsAgreement)) {
    throw new Error('Agreements not found')
  }

  const agreementMap = useMemo<
    Record<CustomerOrganizationType, AgreementDomainQueryModel>
  >(
    () => ({
      brand: clientTermsAgreement,
      agency: makerTermsAgreement,
    }),
    [clientTermsAgreement, makerTermsAgreement]
  )

  return agreementMap[organizationType]
}
