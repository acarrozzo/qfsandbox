import { useState } from 'react'

import type { DeliverableDetails } from '@mntn-dev/domain-types'
import { Controller, useFieldArray, useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { UpdateServiceInput } from '@mntn-dev/package-service/client'
import { Button } from '@mntn-dev/ui-components'

import { DeliverableModal } from '../services/components/deliverable/deliverable-modal.tsx'
import type { DeliverableState } from '../services/components/deliverable/types.ts'
import { DeliverablesList } from './deliverables-list.tsx'

type DeliverablesEditorProps = {
  deliverables: Array<DeliverableDetails> | undefined
  isDisabled: boolean
  isReadonly: boolean
}

export const DeliverablesEditor = ({
  deliverables,
  isDisabled,
  isReadonly,
}: DeliverablesEditorProps) => {
  const { t } = useTranslation(['service-details'])

  const [deliverableState, setDeliverableState] = useState<
    DeliverableState | undefined
  >()

  const { control, resetField } =
    useFormContext<Pick<UpdateServiceInput, 'deliverables'>>()

  const { append } = useFieldArray({
    control,
    name: 'deliverables',
  })

  const handleDeliverableClick = (index: number) => {
    if (deliverables && deliverables[index] !== undefined) {
      setDeliverableState({
        index,
        isNew: false,
      })
    }
  }

  const handleAddDeliverableClick = () => {
    append({ category: 'file', reviewLevel: 'none' })

    setDeliverableState({
      index: deliverables?.length ?? 0,
      isNew: true,
    })
  }

  const handleDeliverableModalClose = () => {
    setDeliverableState(undefined)
  }

  const handleDeliverablesChange = (
    deliverables: Array<DeliverableDetails>
  ) => {
    resetField('deliverables', { defaultValue: deliverables })
  }

  return (
    <>
      <DeliverablesList
        deliverables={deliverables}
        onClick={isDisabled ? undefined : handleDeliverableClick}
      />
      {!isReadonly && (
        <Button
          width="full"
          disabled={isDisabled}
          iconRight="add"
          variant="secondary"
          onClick={handleAddDeliverableClick}
        >
          {t('service-details:action.add-deliverable')}
        </Button>
      )}
      <Controller
        name="deliverables"
        control={control}
        render={({ field: { value } }) => (
          <>
            {deliverableState && value && (
              <DeliverableModal
                open={true}
                onChange={handleDeliverablesChange}
                onClose={handleDeliverableModalClose}
                deliverableState={deliverableState}
                deliverables={value}
                isDisabled={isDisabled || isReadonly}
                isReadonly={isReadonly}
              />
            )}
          </>
        )}
      />
    </>
  )
}
