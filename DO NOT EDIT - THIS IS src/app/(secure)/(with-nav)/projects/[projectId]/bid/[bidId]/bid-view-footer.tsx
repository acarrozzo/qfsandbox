import type { BillingMethod } from '@mntn-dev/domain-types'
import { useController } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Form,
  FormField,
  Select,
  SidebarLayoutFooter,
  Stack,
} from '@mntn-dev/ui-components'

import { useBidContext } from '#projects/[projectId]/bid/hooks/use-bid.ts'

import { BidAgreement } from './bid-agreement.tsx'

type BidViewFooterProps = {
  isCreditProgramProject?: boolean
}

export const BidViewFooter = ({
  isCreditProgramProject,
}: BidViewFooterProps) => {
  const { t } = useTranslation(['bids'])
  const {
    acceptBid,
    agreements: { clientTerms, creditTerms },
    bid,
    chooseBidForm,
    handleRejectBidClick,
    handleSetChosenBillingMethod,
    project,
    rejectBid,
    setShowConfirmModal,
    showCurrencyChooser,
  } = useBidContext()
  const { control, handleSubmit } = chooseBidForm

  const {
    field: clientTermsField,
    fieldState: { error: clientTermsError },
  } = useController({
    control,
    name: 'termsAccepted',
  })

  const {
    field: creditTermsField,
    fieldState: { error: creditTermsError },
  } = useController({
    control,
    name: 'creditTermsAccepted',
  })

  if (!(bid.acl.canAcceptBid || bid.acl.canRejectBid)) {
    return
  }

  return (
    <SidebarLayoutFooter>
      <Form
        id="chooseBidForm"
        className="w-full"
        onSubmit={handleSubmit((data) => {
          if (data.termsAccepted) {
            setShowConfirmModal('accept-bid')
          }
        })}
        dataTestId="choose-bid-form"
        dataTrackingId="choose-bid-form"
      >
        <div className="flex justify-between items-center w-full gap-4">
          <Stack direction="col" gap="4">
            <FormField
              hasError={!!clientTermsError}
              dataTestId="terms-conditions-checkbox-field"
              dataTrackingId="terms-conditions-checkbox-field"
            >
              <BidAgreement
                agreementType="client-terms"
                disabled={
                  !clientTerms?.link ||
                  acceptBid.isPending ||
                  rejectBid.isPending
                }
                href={clientTerms?.link}
                {...clientTermsField}
              />
              <FormField.Error>{clientTermsError?.message}</FormField.Error>
            </FormField>
            {isCreditProgramProject && (
              <FormField
                hasError={!!creditTermsError}
                dataTestId="credit-program-terms-checkbox-field"
                dataTrackingId="credit-program-terms-checkbox-field"
              >
                <BidAgreement
                  agreementType="credit-terms"
                  disabled={
                    !creditTerms?.link ||
                    acceptBid.isPending ||
                    rejectBid.isPending
                  }
                  href={creditTerms?.link}
                  {...creditTermsField}
                />
                <FormField.Error>{creditTermsError?.message}</FormField.Error>
              </FormField>
            )}
          </Stack>

          <Stack gap="4">
            {showCurrencyChooser && (
              <Select
                searchable={false}
                deselectable={false}
                defaultValue={
                  project.chosenBillingMethod === 'none' ||
                  !project.chosenBillingMethod
                    ? null
                    : project.chosenBillingMethod
                }
                onChange={handleSetChosenBillingMethod}
                placeholder={t('bids:choose-billing-method')}
                className="w-96 items-end shrink"
                dataTestId="currency-credit-chooser"
                dataTrackingId="currency-credit-chooser"
                options={[
                  ...project.billingMethods.map((method: BillingMethod) => ({
                    value: method,
                    label: t(`bids:billing-methods.${method}`),
                  })),
                ]}
              />
            )}

            <Button
              variant="secondary"
              width="80"
              onClick={handleRejectBidClick}
              loading={rejectBid.isPending}
              disabled={acceptBid.isPending}
              dataTestId="bid-reject-button"
              dataTrackingId="bid-reject-button"
            >
              {t('bids:dismiss-bid')}
            </Button>
            <Button
              type="submit"
              form="chooseBidForm"
              variant="primary"
              width="80"
              loading={acceptBid.isPending}
              disabled={rejectBid.isPending}
              dataTestId="bid-accept-button"
              dataTrackingId="bid-accept-button"
            >
              {t('bids:accept-bid')}
            </Button>
          </Stack>
        </div>
      </Form>
    </SidebarLayoutFooter>
  )
}
