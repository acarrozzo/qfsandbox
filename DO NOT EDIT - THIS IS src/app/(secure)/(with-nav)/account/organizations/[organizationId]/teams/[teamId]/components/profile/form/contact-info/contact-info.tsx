import { useFlags } from '@mntn-dev/flags-client'

import { ContactInfo as ContactInfoV1 } from '../contact-info-v1/contact-info.tsx'
import { ContactInfo as ContactInfoV2 } from '../contact-info-v2/contact-info.tsx'

const ContactInfo = () => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return <ContactInfoV2 />
  }

  return <ContactInfoV1 />
}

export { ContactInfo }
