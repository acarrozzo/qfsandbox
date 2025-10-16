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
    creditBalance?: number
  }>
  handleCheckboxChange: (
    programKind: CreditProgramKind
  ) => (value: boolean) => Promise<void>
  // todo: temporarily removed as part of QFMP-3974
  // handleMNTNAdvertiserIDChange: (
  //   advertiserId: CreditProgramMembershipId
  // ) => void
}

export const PartnerProgramAccessList = ({
  accessList,
  handleCheckboxChange,
  // handleMNTNAdvertiserIDChange, // todo: temporarily removed as part of QFMP-3974
}: ProgramAccessListProps) => {
  const { t } = useTranslation(['partner-programs'])

  // todo: temporarily removed as part of QFMP-3974
  // const inputRef = useRef<HTMLInputElement>(null)
  // const [advertiserId, setAdvertiserId] = useState<string | undefined>(
  //   accessList.find((p) => p.programKind === 'mntn_credits')
  //     ?.programMembershipId
  // )
  //
  // useEffect(() => {
  //   const updatedId = accessList.find(
  //     (p) => p.programKind === 'mntn_credits'
  //   )?.programMembershipId
  //
  //   setAdvertiserId(updatedId)
  //   if (inputRef.current) {
  //     inputRef.current.value = updatedId ?? ''
  //   }
  // }, [accessList])

  return (
    <>
      <Surface.Body>
        <FormField>
          <FormField.Label>{t('partner-programs:title.brand')}</FormField.Label>
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
      {/* todo: temporarily removed as part of QFMP-3974 */}
      {/*<Surface.Body>*/}
      {/*  <Text>MNTN ID</Text>*/}
      {/*  <FormField>*/}
      {/*    <FormField.Label>MNTN Advertiser ID</FormField.Label>*/}
      {/*    <Input*/}
      {/*      ref={inputRef}*/}
      {/*      placeholder="Enter ID"*/}
      {/*      defaultValue={advertiserId ?? ''}*/}
      {/*      disabled={!!advertiserId}*/}
      {/*      onBlur={(e) =>*/}
      {/*        handleMNTNAdvertiserIDChange(*/}
      {/*          e.currentTarget.value as CreditProgramMembershipId*/}
      {/*        )*/}
      {/*      }*/}
      {/*    />*/}

      {/*    /!**/}
      {/*      todo: QF-3508 - add button + pop out modal for looking up MNTN Advertiser ID*/}
      {/*      <Button variant="secondary">MNTN Advertiser ID Lookup</Button>*/}
      {/*    *!/*/}
      {/*  </FormField>*/}
      {/*</Surface.Body>*/}
    </>
  )
}
