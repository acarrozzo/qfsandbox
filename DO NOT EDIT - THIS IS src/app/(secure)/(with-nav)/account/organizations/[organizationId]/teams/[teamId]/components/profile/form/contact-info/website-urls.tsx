import { useFlags } from '@mntn-dev/flags-client'

import { WebsiteUrls as WebsiteUrlsV1 } from '../contact-info-v1/website-urls.tsx'
import { WebsiteUrls as WebsiteUrlsV2 } from '../contact-info-v2/website-urls.tsx'

const WebsiteUrls = () => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return <WebsiteUrlsV2 />
  }

  return <WebsiteUrlsV1 />
}

export { WebsiteUrls }
