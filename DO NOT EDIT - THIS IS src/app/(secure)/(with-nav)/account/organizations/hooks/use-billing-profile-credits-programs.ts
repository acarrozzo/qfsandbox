import { useMemo } from 'react'

import {
  type BillingProfileId,
  type CreditProgramKind,
  CreditProgramKindSchema,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export type UseBillingProfileCreditsProgramsProps = {
  billingProfileId: BillingProfileId
}

export const useBillingProfileCreditsPrograms = ({
  billingProfileId,
}: UseBillingProfileCreditsProgramsProps) => {
  const { t } = useTranslation(['partner-programs'])

  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )

  assertExists(
    billingProfile,
    'Billing profile is required in useBillingProfileCreditsPrograms'
  )

  const { data: organizationPartnerPrograms } =
    trpcReactClient.organizations.getOrganizationPartnerPrograms.useQuery(
      {
        organizationId: billingProfile.organizationId,
      },
      {
        refetchOnMount: false,
      }
    )

  const creditPrograms = useMemo(
    () =>
      CreditProgramKindSchema.options.map((program) => {
        const partnerProgram = organizationPartnerPrograms?.find(
          (p) => p.creditProgramKind === program
        )

        const creditProgram: CreditProgramInfo = {
          programKind: program,
          label: t(`partner-programs:kind.${program}`),
          isChecked: !!partnerProgram,
          tooltipText: t(`partner-programs:tooltip.${program}.brand`),
          enabled: true,
        }
        return creditProgram
      }),
    [organizationPartnerPrograms, t]
  )

  return {
    creditPrograms,
  }
}

export type CreditProgramInfo = {
  programKind: CreditProgramKind
  label: string
  isChecked: boolean
  tooltipText: string
  enabled: boolean
}
