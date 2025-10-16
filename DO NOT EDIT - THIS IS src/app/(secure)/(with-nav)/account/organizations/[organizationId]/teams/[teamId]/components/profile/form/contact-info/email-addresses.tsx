import { useFlags } from '@mntn-dev/flags-client'

import { EmailAddresses as EmailAddressesV1 } from '../contact-info-v1/email-addresses.tsx'
import { EmailAddresses as EmailAddressesV2 } from '../contact-info-v2/email-addresses.tsx'

const EmailAddresses = () => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return <EmailAddressesV2 />
  }

  return <EmailAddressesV1 />
}

export { EmailAddresses }
