import { Surface } from '@mntn-dev/ui-components'
import { themeBorderColorMap, themeDivideColorMap } from '@mntn-dev/ui-theme'

import { PackageCheckoutBlade } from '#projects/components/services/checkout/package-checkout-blade.tsx'
import { usePackageBrowserContext } from '#projects/hooks/use-package-browser.ts'

export const PackageCheckoutBody = () => {
  const { pendingPackageServices, onRemove, showCredits, packageSource } =
    usePackageBrowserContext()

  return (
    <Surface.Body
      height="full"
      className={`divide-y overflow-auto ${themeDivideColorMap.muted}`}
    >
      <div
        className={`flex flex-col items-start divide-y self-stretch border-t ${themeDivideColorMap.muted} ${themeBorderColorMap.muted}`}
      >
        {pendingPackageServices.length > 0 &&
          pendingPackageServices.map((packageService, index) => (
            <PackageCheckoutBlade
              key={packageService.serviceId}
              service={packageService}
              onRemove={() => onRemove(index)}
              showCredits={showCredits}
              packageSource={packageSource}
              dataTestId={`additional-service-blade-${packageService.serviceId}`}
            />
          ))}
      </div>
    </Surface.Body>
  )
}
