import { useCallback } from 'react'

import {
  AgencyApprovedProgramKindSchema,
  type CreditProgramKind,
  CreditProgramKindSchema,
  type FinanceEntityId,
  type OrganizationId,
  RequiredCertificationKeyProgramKindMap,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export type OrganizationPartnerProgramsProps = {
  organizationId: OrganizationId
  financeEntityId: FinanceEntityId
}

export const useOrganizationPartnerPrograms = ({
  organizationId,
  financeEntityId,
}: OrganizationPartnerProgramsProps) => {
  const { t } = useTranslation(['partner-programs'])

  const [organization] =
    trpcReactClient.organizations.getOrganization.useSuspenseQuery({
      organizationId,
    })

  const { data, isSuccess, isLoading, refetch } =
    trpcReactClient.organizations.getOrganizationPartnerPrograms.useQuery({
      organizationId,
    })

  const addCreditsToBrand =
    trpcReactClient.finance.addCreditsToBrand.useMutation()
  const updateOrganizationPartnerPrograms =
    trpcReactClient.organizations.updateOrganizationPartnerPrograms.useMutation()

  const programs = isSuccess ? data : []

  const accessList =
    organization.organizationType === 'brand'
      ? CreditProgramKindSchema.options.map((kind) => {
          const program = programs.find((p) => p.creditProgramKind === kind)
          return {
            programKind: kind,
            programMembershipId: program?.programMembershipId,
            label: t(`partner-programs:kind.${kind}`),
            isChecked: !!program,
            // todo: temporarily removed i18n translation as part of QFMP-3974
            tooltipText: t(`partner-programs:tooltip.${kind}.brand`),
            enabled: true,
            // todo: temporarily removed as part of QFMP-3974
            // !CreditProgramRequiresMembership[kind] ||
            // !!program?.programMembershipId,
            creditBalance: program?.creditBalance,
          }
        })
      : AgencyApprovedProgramKindSchema.options.map((kind) => {
          const program = programs.find((p) => p.creditProgramKind === kind)
          const requiredCertificationKey =
            RequiredCertificationKeyProgramKindMap[kind]
          return {
            programKind: kind,
            programMembershipId: program?.programMembershipId,
            label: t(`partner-programs:kind.${kind}`),
            isChecked: !!program,
            tooltipText: t(`partner-programs:tooltip.${kind}.agency`, {
              certification: requiredCertificationKey,
            }),
            enabled:
              !requiredCertificationKey ||
              (organization.tags?.some(
                (tag) => tag.key === requiredCertificationKey
              ) ??
                false),
          }
        })

  const handleCheckboxChange = useCallback(
    (programKind: CreditProgramKind) => async (value: boolean) => {
      await updateOrganizationPartnerPrograms.mutateAsync({
        organizationId,
        partnerProgramKind: programKind,
        isEnabled: value,
        programMembershipId: undefined,
      })
      refetch()
    },
    [organizationId, updateOrganizationPartnerPrograms, refetch]
  )

  const handleCreditUpdate = useCallback(
    async ({
      creditsToAdd,
      creditProgramKind,
      expirationDate,
    }: {
      creditsToAdd: number
      creditProgramKind: CreditProgramKind
      expirationDate?: Date
    }) => {
      await addCreditsToBrand.mutateAsync({
        financeEntityId,
        amount: creditsToAdd,
        creditProgramKind: creditProgramKind,
        expirationDate: expirationDate,
      })
      refetch()
    },
    [financeEntityId, addCreditsToBrand, refetch]
  )

  // todo: temporarily removed as part of QFMP-3974
  // const handleMNTNAdvertiserIDChange = useCallback(
  //   async (creditProgramMembershipId: CreditProgramMembershipId) => {
  //     await updateOrganizationPartnerPrograms.mutateAsync({
  //       organizationId,
  //       partnerProgramKind: 'mntn_credits',
  //       isEnabled: !!creditProgramMembershipId,
  //       programMembershipId: creditProgramMembershipId ?? undefined,
  //     })
  //     refetch()
  //   },
  //
  //   [organizationId, updateOrganizationPartnerPrograms, refetch]
  // )

  return {
    data,
    isLoading,
    refetch,
    accessList,
    handleCheckboxChange,
    handleCreditUpdate,
    // handleMNTNAdvertiserIDChange, // todo: temporarily removed as part of QFMP-3974
    organization,
    savingCredits: addCreditsToBrand.isPending,
  }
}
