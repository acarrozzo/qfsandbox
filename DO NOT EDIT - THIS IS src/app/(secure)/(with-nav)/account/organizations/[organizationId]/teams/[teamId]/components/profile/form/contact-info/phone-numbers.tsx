import { useFlags } from '@mntn-dev/flags-client'

import { PhoneNumbers as PhoneNumbersV1 } from '../contact-info-v1/phone-numbers.tsx'
import { PhoneNumbers as PhoneNumbersV2 } from '../contact-info-v2/phone-numbers.tsx'

const PhoneNumbers = () => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return <PhoneNumbersV2 />
  }

  return <PhoneNumbersV1 />
}

export { PhoneNumbers }
