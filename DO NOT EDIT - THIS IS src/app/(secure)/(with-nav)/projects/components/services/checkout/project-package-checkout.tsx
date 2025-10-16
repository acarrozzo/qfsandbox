import { Surface } from '@mntn-dev/ui-components'

import { PackageCheckoutBody } from '#projects/components/services/checkout/package-checkout-body.tsx'
import { PackageCheckoutFooter } from '#projects/components/services/checkout/package-checkout-footer.tsx'
import { PackageCheckoutHeader } from '#projects/components/services/checkout/package-checkout-header.tsx'

export const ProjectPackageCheckout = () => {
  return (
    <Surface className="h-[calc(100vh*0.80)] divide-none">
      <PackageCheckoutHeader />
      <PackageCheckoutBody />
      <PackageCheckoutFooter />
    </Surface>
  )
}
