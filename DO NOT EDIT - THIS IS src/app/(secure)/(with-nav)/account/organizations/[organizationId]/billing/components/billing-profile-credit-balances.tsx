import { useCallback, useState } from 'react'

import { PartnerProgramLogo } from '@mntn-dev/app-ui-components/partner-program-logo'
import type {
  BillingProfileId,
  CreditProgramKind,
} from '@mntn-dev/domain-types'
import {
  Button,
  Icon,
  Input,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { cn } from '@mntn-dev/ui-utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { AddCreativeCreditsModal } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/components/add-creative-credits-modal.tsx'
import {
  type CreditProgramInfo,
  useBillingProfileCreditsPrograms,
} from '~/app/(secure)/(with-nav)/account/organizations/hooks/use-billing-profile-credits-programs.ts'

type BillingProfileCreditBalancesProps = {
  billingProfileId: BillingProfileId
}

export const BillingProfileCreditBalances = ({
  billingProfileId,
}: BillingProfileCreditBalancesProps) => {
  const { creditPrograms } = useBillingProfileCreditsPrograms({
    billingProfileId,
  })

  const [selectedCreditProgram, setSelectedCreditProgram] = useState<
    CreditProgramKind | undefined
  >(undefined)

  const handleClose = useCallback(() => {
    setSelectedCreditProgram(undefined)
  }, [])

  const handleSelect = useCallback(
    (programKind: CreditProgramKind) => () => {
      setSelectedCreditProgram(programKind)
    },
    []
  )

  return (
    <Surface.Body>
      <Stack gap="4" justifyContent="between" alignItems="end">
        {creditPrograms.map((program) => {
          return (
            <CreditProgramBalance
              key={program.programKind}
              billingProfileId={billingProfileId}
              creditProgram={program}
              isSelected={selectedCreditProgram === program.programKind}
              onClose={handleClose}
              onSelect={handleSelect(program.programKind)}
            />
          )
        })}
      </Stack>
    </Surface.Body>
  )
}

type CreditProgramBalanceProps = {
  billingProfileId: BillingProfileId
  creditProgram: CreditProgramInfo
  isSelected: boolean
  onSelect: () => void
  onClose: () => void
}

const CreditProgramBalance = ({
  billingProfileId,
  creditProgram,
  isSelected,
  onClose,
  onSelect,
}: CreditProgramBalanceProps) => {
  const { data: balance, refetch } =
    trpcReactClient.financeCoordinator.getBillingProfileCreditBalance.useQuery(
      {
        billingProfileId,
        creditProgramKind: creditProgram.programKind,
      },
      {
        refetchOnMount: false,
      }
    )

  const { mutateAsync: saveCredits, isPending: isSaving } =
    trpcReactClient.financeCoordinator.addCreditsToBillingProfile.useMutation({
      onSuccess: () => {
        refetch()
      },
    })

  const handleCreditUpdate = async ({
    creditProgramKind,
    creditsToAdd,
    expirationDate,
  }: {
    creditProgramKind: CreditProgramKind
    creditsToAdd: number
    expirationDate?: Date
  }) => {
    await saveCredits({
      billingProfileId,
      amount: creditsToAdd,
      creditProgramKind,
      expirationDate,
    })
  }

  return (
    <>
      <Stack
        key={creditProgram.programKind}
        direction="col"
        justifyContent="center"
        alignItems="center"
        gap="2"
        className={cn(
          'text-center',
          !creditProgram.isChecked &&
            'opacity-50 pointer-events-none cursor-not-allowed'
        )}
      >
        <Text textColor="secondary" fontSize="sm">
          {creditProgram.label}
        </Text>
        <Stack justifyContent="between" alignItems="center" gap="2">
          <PartnerProgramLogo partnerProgram={creditProgram.programKind} />
          <Input value={`${balance?.credits ?? 0}`} readOnly />
          <Button variant="secondary" onClick={onSelect}>
            <Icon name="add" size="md" color="brand" />
          </Button>
        </Stack>
      </Stack>
      {isSelected && (
        <AddCreativeCreditsModal
          open={isSelected}
          onClose={onClose}
          creditProgramKind={creditProgram.programKind}
          currentCredits={balance?.credits ?? 0}
          handleCreditUpdate={handleCreditUpdate}
          saving={isSaving}
        />
      )}
    </>
  )
}
