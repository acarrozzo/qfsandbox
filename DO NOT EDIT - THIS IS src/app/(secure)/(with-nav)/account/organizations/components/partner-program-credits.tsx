import { useState } from 'react'

import { PartnerProgramLogo } from '@mntn-dev/app-ui-components/partner-program-logo'
import type {
  CreditProgramKind,
  CreditProgramMembershipId,
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

import { AddCreativeCreditsModal } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/components/add-creative-credits-modal.tsx'

type PartnerProgramCreditsProps = {
  accessList: Array<{
    programKind: CreditProgramKind
    programMembershipId?: CreditProgramMembershipId
    label: string
    isChecked: boolean
    tooltipText: string
    enabled: boolean
    creditBalance?: number
  }>
  handleCreditUpdate: ({
    creditsToAdd,
    creditProgramKind,
    expirationDate,
  }: {
    creditsToAdd: number
    creditProgramKind: CreditProgramKind
    expirationDate?: Date
  }) => Promise<void>
  saving?: boolean
}

export const PartnerProgramCredits = ({
  accessList,
  handleCreditUpdate,
  saving,
}: PartnerProgramCreditsProps) => {
  const [selectedCreditProgram, setSelectedCreditProgram] = useState<
    CreditProgramKind | undefined
  >(undefined)

  return (
    <Surface.Body>
      <Stack gap="4" justifyContent="between" alignItems="end">
        {accessList.map((program) => {
          return (
            <Stack
              key={program.programKind}
              direction="col"
              justifyContent="center"
              alignItems="center"
              gap="2"
              className={cn(
                'text-center',
                !program.isChecked &&
                  'opacity-50 pointer-events-none cursor-not-allowed'
              )}
            >
              <Text textColor="secondary" fontSize="sm">
                {program.label}
              </Text>
              <Stack justifyContent="between" alignItems="center" gap="2">
                <PartnerProgramLogo partnerProgram={program.programKind} />
                <Input value={`${program.creditBalance ?? 0}`} readOnly />
                <Button
                  variant="secondary"
                  onClick={() => setSelectedCreditProgram(program.programKind)}
                >
                  <Icon name="add" size="md" color="brand" />
                </Button>
              </Stack>
            </Stack>
          )
        })}
      </Stack>
      {selectedCreditProgram && (
        <AddCreativeCreditsModal
          open={!!selectedCreditProgram}
          onClose={() => setSelectedCreditProgram(undefined)}
          creditProgramKind={selectedCreditProgram}
          currentCredits={
            accessList.find(
              (program) => program.programKind === selectedCreditProgram
            )?.creditBalance ?? 0
          }
          handleCreditUpdate={handleCreditUpdate}
          saving={saving}
        />
      )}
    </Surface.Body>
  )
}
