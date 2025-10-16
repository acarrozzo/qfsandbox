import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'

import { InvoiceContactsList as InvoiceContactsListV1 } from './invoice-contacts-list-v1.tsx'
import { InvoiceContactsList as InvoiceContactsListV2 } from './invoice-contacts-list-v2.tsx'

export type InvoiceContactsListProps = {
  billingProfileId: BillingProfileId
}

export const InvoiceContactsList = ({
  billingProfileId,
}: InvoiceContactsListProps) => {
  const { multipleBillingProfiles } = useFlags()
  if (multipleBillingProfiles) {
    return <InvoiceContactsListV2 billingProfileId={billingProfileId} />
  }
  return <InvoiceContactsListV1 billingProfileId={billingProfileId} />
}
