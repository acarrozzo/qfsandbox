import { useTranslation } from '@mntn-dev/i18n'
import type { PackageServiceWithAcl } from '@mntn-dev/project-service'
import { useToast } from '@mntn-dev/ui-components'

import { usePackageBrowserContext } from '#projects/hooks/use-package-browser.ts'

import { PackageServiceList } from './package-service-list.tsx'

export const ProjectServices = () => {
  const { t } = useTranslation(['toast'])
  const { showToast } = useToast()

  const { onAdd, allPackageServices } = usePackageBrowserContext()

  const handleAdd = (packageService: PackageServiceWithAcl) => {
    onAdd(packageService)

    showToast.info({
      title: t('toast:service.checkout.title'),
      body: t('toast:service.checkout.body', { name: packageService.name }),
      dataTestId: 'service-checkout-info-toast',
      dataTrackingId: 'service-checkout-info-toast',
    })
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="scroll-hidden max-h-[calc(100vh*0.80)] w-full overflow-y-auto pr-4">
        <PackageServiceList>
          {allPackageServices.map((packageService) => (
            <PackageServiceList.Item
              key={packageService.packageServiceId}
              packageService={packageService}
              onAdd={() => handleAdd(packageService)}
            />
          ))}
        </PackageServiceList>
      </div>
    </div>
  )
}
