'use client'

import type { TFunction } from 'i18next'
import { useState } from 'react'

import {
  DeliverableCategories,
  type DeliverableCategory,
  type DeliverableDetails,
} from '@mntn-dev/domain-types'
import { Controller, useFormContext } from '@mntn-dev/forms'
import { NarrowTFunction, useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Form,
  FormField,
  Modal,
  ModalOverlineHeader,
  type ModalProps,
  Select,
  type SelectOptionData,
} from '@mntn-dev/ui-components'
import { defined, replaceAtIndex } from '@mntn-dev/utilities'

import { DeliverableFormFields } from './form-fields/deliverable-form-fields.tsx'
import type { DeliverableState, DeliverablesFragment } from './types.ts'

const getDeliverableCategoryOptions = (
  t: TFunction<['deliverable']>
): SelectOptionData<DeliverableCategory>[] =>
  DeliverableCategories.map((category) => ({
    value: category,
    label: t(`deliverable:category.${category}`),
  }))

type DeliverableModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    onChange: (value: Array<DeliverableDetails>) => void
    deliverables: Array<DeliverableDetails>
    deliverableState: DeliverableState
    isDisabled: boolean
    isReadonly: boolean
  }>

const DeliverableModal = ({
  onChange,
  deliverables: initialDeliverables,
  deliverableState,
  deliverableState: { index: deliverableIndex, isNew },
  isDisabled,
  isReadonly,
  onClose,
  ...props
}: DeliverableModalProps) => {
  const { t } = useTranslation([
    'deliverable-details',
    'validation',
    'deliverable',
  ])

  const initialDeliverable = initialDeliverables
    ? initialDeliverables[deliverableIndex]
    : undefined

  const [isTriggered, setIsTriggered] = useState(false)

  const { watch, trigger, formState, control } =
    useFormContext<DeliverablesFragment>()

  const { errors } = formState
  const deliverables = watch('deliverables')
  const deliverable = deliverables[deliverableIndex]

  const handleRemoveClick = () => {
    onChange(
      defined(replaceAtIndex(initialDeliverables, deliverableIndex, undefined))
    )
    onClose()
  }

  const handleCancelClick = () => {
    if (isNew) {
      handleRemoveClick()
    } else {
      onChange(
        defined(
          replaceAtIndex(
            initialDeliverables,
            deliverableIndex,
            initialDeliverable
          )
        )
      )
      onClose()
    }
  }

  const handleSaveClick = async () => {
    if (await trigger('deliverables')) {
      onChange(
        defined(
          replaceAtIndex(initialDeliverables, deliverableIndex, deliverable)
        )
      )
      onClose()
    } else {
      setIsTriggered(true)
    }
  }

  return (
    <Modal className="w-160" onClose={handleCancelClick} {...props}>
      <Modal.Overline>
        <ModalOverlineHeader
          dataTestId="package-quickview-modal-header"
          dataTrackingId="package-quickview-modal-header"
        >
          <ModalOverlineHeader.Main>
            <ModalOverlineHeader.Overline>
              <ModalOverlineHeader.OverlineLink onClick={handleCancelClick}>
                {t('back', { ns: 'generic' })}
              </ModalOverlineHeader.OverlineLink>
            </ModalOverlineHeader.Overline>
            <ModalOverlineHeader.Title title={t('deliverable-details:title')} />
          </ModalOverlineHeader.Main>
        </ModalOverlineHeader>
      </Modal.Overline>
      <Modal.Dialog className="w-full p-0">
        <Modal.Body className="px-8 py-6">
          <Form.Layout>
            <FormField columnSpan={6} className="w-full">
              <FormField.Label>
                {t('deliverable-details:field.category')}
              </FormField.Label>
              <FormField.Control>
                <Controller
                  name={`deliverables.${deliverableIndex}.category`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      searchable={false}
                      deselectable={false}
                      options={getDeliverableCategoryOptions(
                        NarrowTFunction<['deliverable']>(t)
                      )}
                      value={field.value}
                      disabled={isDisabled}
                    />
                  )}
                />
              </FormField.Control>
            </FormField>
            {deliverable && (
              <DeliverableFormFields
                category={deliverable.category}
                {...{
                  deliverableIndex,
                  control,
                  errors,
                  isTriggered,
                  t,
                  isDisabled,
                }}
              />
            )}
          </Form.Layout>
        </Modal.Body>
        {!isReadonly && (
          <Modal.Footer className="w-full flex flex-row gap-6 bg-container-tertiary px-8 py-6">
            <div className="w-1/2">
              {isNew ? (
                <Button
                  variant="text"
                  onClick={handleCancelClick}
                  className="w-full"
                >
                  {t('deliverable-details:action.cancel')}
                </Button>
              ) : (
                <Button
                  variant="text"
                  onClick={handleRemoveClick}
                  disabled={isDisabled}
                  className="w-full"
                >
                  {t('deliverable-details:action.remove')}
                </Button>
              )}
            </div>
            <Button onClick={handleSaveClick} className="w-1/2">
              {t('deliverable-details:action.save')}
            </Button>
          </Modal.Footer>
        )}
      </Modal.Dialog>
    </Modal>
  )
}

export { DeliverableModal, type DeliverableModalProps }
