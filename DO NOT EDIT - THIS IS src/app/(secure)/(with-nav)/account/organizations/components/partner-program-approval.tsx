'use client'

import type {
  CreditProgramKind,
  CreditProgramMembershipId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Checkbox,
  FormField,
  Icon,
  Stack,
  Surface,
  Text,
  Tooltip,
} from '@mntn-dev/ui-components'

type ProgramAccessListProps = {
  accessList: Array<{
    programKind: CreditProgramKind
    programMembershipId?: CreditProgramMembershipId
    label: string
    isChecked: boolean
    tooltipText: string
    enabled: boolean
  }>
  handleCheckboxChange: (
    programKind: CreditProgramKind
  ) => (value: boolean) => Promise<void>
}

export const PartnerProgramApproval = ({
  accessList,
  handleCheckboxChange,
}: ProgramAccessListProps) => {
  const { t } = useTranslation(['partner-programs'])

  return (
    <Surface.Body>
      <FormField>
        <FormField.Label>{t('partner-programs:title.agency')}</FormField.Label>
        <FormField.Control>
          <div className="grid grid-cols-2 grid-rows-[repeat(auto-fill, minmax(100px, 1fr))] gap-4">
            {accessList.map((program) => (
              <Stack
                inline
                key={program.label}
                direction="row"
                gap="4"
                alignItems="center"
                className="w-full"
              >
                <Checkbox
                  onChange={handleCheckboxChange(program.programKind)}
                  value={program.isChecked}
                  disabled={!program.enabled}
                >
                  <Text className="whitespace-nowrap">{program.label}</Text>
                </Checkbox>

                {program.tooltipText && (
                  <Tooltip content={program.tooltipText} variant="inverse">
                    <div>
                      <Icon
                        name="information"
                        size="sm"
                        fill="solid"
                        color="brand"
                      />
                    </div>
                  </Tooltip>
                )}
              </Stack>
            ))}
          </div>
        </FormField.Control>
      </FormField>
    </Surface.Body>
  )
}
