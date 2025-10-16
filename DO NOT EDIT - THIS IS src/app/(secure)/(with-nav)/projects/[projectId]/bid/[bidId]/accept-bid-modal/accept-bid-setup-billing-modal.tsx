import { useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import { Alert, DialogModal, useToast } from '@mntn-dev/ui-components'

import { useBidContext } from '#projects/[projectId]/bid/hooks/use-bid.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'
import type { SetupBillingType } from '~/utils/project/billing.ts'

export type AcceptBidSetupBillingModalProps = {
  open: boolean
  onClose: () => void
  setupType: SetupBillingType
}

export const AcceptBidSetupBillingModal = ({
  open,
  onClose,
  setupType,
}: AcceptBidSetupBillingModalProps) => {
  const router = useRouter()
  const { showToast } = useToast()
  const { hasPermission } = usePermissions()
  const { t } = useTranslation(['bids', 'generic', 'toast'])
  const { brandOrganizationId } = useBidContext()

  const [redirecting, setRedirecting] = useState(false)

  const handleRedirectToBilling = () => {
    if (
      hasPermission('customer-organization:administer') ||
      hasPermission('own-organization:administer')
    ) {
      setRedirecting(true)
      if (setupType === 'payment-method') {
        router.push(
          route(
            '/account/organizations/:organizationId/billing/methods'
          ).params({
            organizationId: brandOrganizationId,
          })
        )
      }
      router.push(
        route('/account/organizations/:organizationId/billing').params({
          organizationId: brandOrganizationId,
        })
      )
    } else {
      showToast.error({
        title: t(
          `toast:bidding.errors.admin-action-required.${setupType}.title`
        ),
        body: t(`toast:bidding.errors.admin-action-required.${setupType}.body`),
        dataTestId: 'admin-action-required-toast',
        dataTrackingId: 'admin-action-required-toast',
      })
    }
  }

  return (
    <DialogModal open={open} onClose={onClose} className="min-h-120">
      <DialogModal.Header>
        <DialogModal.Title>
          {t('bids:setup-billing-modal.title')}
        </DialogModal.Title>
      </DialogModal.Header>
      <DialogModal.Body>
        <div className="flex flex-col gap-8">
          <Alert type="warning" className="bg-transparent border-none p-0">
            <Alert.Main>
              <Alert.Indicator size="2xl" />
              <Alert.Details>
                <Alert.Title className="font-medium text-base">
                  {t(`bids:setup-billing-modal.${setupType}.warning`)}
                </Alert.Title>
              </Alert.Details>
            </Alert.Main>
          </Alert>
          {/* TODO: add extra context/description here */}
        </div>
      </DialogModal.Body>
      <DialogModal.Footer>
        <DialogModal.AcceptButton
          loading={redirecting}
          onClick={handleRedirectToBilling}
        >
          {t(`bids:setup-billing-modal.${setupType}.button`)}
        </DialogModal.AcceptButton>
        <DialogModal.CancelButton onClick={onClose}>
          {t('generic:cancel')}
        </DialogModal.CancelButton>
      </DialogModal.Footer>
    </DialogModal>
  )
}
