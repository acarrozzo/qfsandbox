import type { CreditProgramKind } from '@mntn-dev/domain-types'
import { Controller, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  DatePicker,
  FormField,
  FormModal,
  Heading,
  Input,
  Text,
  useToast,
} from '@mntn-dev/ui-components'

import { getTomorrow } from '#utils/date-helpers.ts'

export const AddCreativeCreditsModal = ({
  open,
  onClose,
  creditProgramKind,
  currentCredits,
  handleCreditUpdate,
  saving,
}: {
  open: boolean
  onClose: () => void
  creditProgramKind: CreditProgramKind
  currentCredits: number
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
}) => {
  const { t } = useTranslation(['generic', 'partner-programs', 'toast'])
  const { showToast } = useToast()

  const minCreditsToAdd = currentCredits > 0 ? currentCredits * -1 : 1

  const defaultValues: {
    creditsToAdd: number
    expirationDate: Date | null
  } = {
    creditsToAdd: 0,
    expirationDate: null,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({
    defaultValues,
  })

  const creditsToAdd = watch('creditsToAdd')

  const onSubmit = async (data: {
    creditsToAdd?: number
    expirationDate?: Date
  }) => {
    try {
      await handleCreditUpdate({
        creditsToAdd: data.creditsToAdd ?? 0,
        expirationDate: data.expirationDate ?? undefined,
        creditProgramKind,
      })
      showToast.success({
        title: t('toast:organization.add-credits-success.title'),
        body: t('toast:organization.add-credits-success.body'),
        dataTestId: 'payment-method-added-error-toast',
        dataTrackingId: 'payment-method-added-error-toast',
      })
      reset()
      onClose()
    } catch (_error) {
      showToast.error({
        title: t('toast:organization.add-credits-failure.title'),
        body: t('toast:organization.add-credits-failure.body'),
        dataTestId: 'payment-method-added-error-toast',
        dataTrackingId: 'payment-method-added-error-toast',
      })
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      dataTestId={`add-credits-${creditProgramKind}-modal`}
      dataTrackingId={`add-credits-${creditProgramKind}-modal`}
    >
      <FormModal.Form
        id={`add-credits-${creditProgramKind}`}
        onSubmit={handleSubmit(onSubmit)}
        dataTestId={`add-credits-${creditProgramKind}-form`}
        dataTrackingId={`add-credits-${creditProgramKind}-form`}
        className="divide-y divide-subtle gap-0"
      >
        <FormModal.Header
          icon={{ name: 'add' }}
          title={t('partner-programs:add-credits', {
            program: t(`partner-programs:short-name.${creditProgramKind}`),
          })}
          className="py-6 px-8"
        />
        <FormModal.Body>
          <div className="flex flex-col p-6 gap-8 justify-center items-center">
            <div className="flex items-end gap-2">
              <Text fontSize="base" className="leading-[1.7]">
                {t('partner-programs:current-credits')}
              </Text>
              <Heading
                textColor="brand"
                fontSize="2xl"
                dataTestId="current-credit-count"
                dataTrackingId="current-credit-count"
              >
                {currentCredits}
              </Heading>
            </div>
            <div className="flex w-2/3 gap-6">
              <FormField className="w-1/3" hasError={!!errors.creditsToAdd}>
                <FormField.Label>
                  {t('partner-programs:credits-to-add')}
                </FormField.Label>
                <Input
                  {...register('creditsToAdd', {
                    valueAsNumber: true,
                    required: true,
                    min: {
                      value: minCreditsToAdd,
                      message: t('partner-programs:credit-balance-error', {
                        count: minCreditsToAdd,
                      }),
                    },
                    validate: (val) => {
                      if (val === 0) {
                        return t('partner-programs:credits-not-zero')
                      }
                    },
                  })}
                  type="number"
                  placeholder="0"
                  required
                  dataTestId="add-credits-input"
                  dataTrackingId="add-credits-input"
                />
                <FormField.Error>
                  {errors.creditsToAdd?.message}
                </FormField.Error>
              </FormField>

              <FormField className="w-2/3" hasError={!!errors.expirationDate}>
                <FormField.Label>
                  {t('partner-programs:credits-expire')}
                </FormField.Label>
                <Controller
                  name="expirationDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date)
                      }}
                      minDate={getTomorrow()}
                      dataTestId="credit-expiration-date-picker"
                      dataTrackingId="credit-expiration-date-picker"
                    />
                  )}
                />
                <FormField.Error>
                  {errors.expirationDate?.message}
                </FormField.Error>
              </FormField>
            </div>
            <div className="flex items-end gap-2">
              <Text fontSize="base" className="leading-[1.7]">
                {t('partner-programs:updated-credits')}
              </Text>
              <Heading
                textColor="brand"
                fontSize="2xl"
                dataTestId="updated-credit-count"
                dataTrackingId="updated-credit-count"
              >
                {currentCredits + (creditsToAdd ?? 0)}
              </Heading>
            </div>
          </div>
        </FormModal.Body>
        <FormModal.Footer>
          <FormModal.AcceptButton type="submit" loading={saving}>
            {t('partner-programs:update-credits')}
          </FormModal.AcceptButton>
          <FormModal.CancelButton onClick={onClose} disabled={saving}>
            {t('generic:close')}
          </FormModal.CancelButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}
