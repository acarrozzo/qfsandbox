import type { PackageSource } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { PackageServiceWithAcl } from '@mntn-dev/project-service'
import {
  CurrencyCreditToggle,
  PageHeader,
  SidebarLayoutContent,
  Stack,
} from '@mntn-dev/ui-components'

import { PackageCheckoutCancelModal } from '#projects/components/services/checkout/package-checkout-cancel-modal.tsx'
import { ProjectPackageCheckout } from '#projects/components/services/checkout/project-package-checkout.tsx'
import { ProjectPackageBrowserHeaderTooltip } from '#projects/components/services/project-package-browser-header-tooltip.tsx'
import { ProjectServices } from '#projects/components/services/project-services.tsx'
import {
  PackageBrowserProvider,
  usePackageBrowser,
} from '#projects/hooks/use-package-browser.ts'
import { TwoColumn } from '~/components/layout/two-column/two-column.tsx'
import type { PackageServiceLike } from '~/lib/package-services/index.ts'

export type ProjectPackageBrowserType = {
  existingPackageServices: PackageServiceLike[]
  onAdd: (service: PackageServiceWithAcl) => void
  onBack: () => void
  onCancel: () => void
  onRemove: (packageServiceIndex: number) => void
  pendingPackageServices: Array<PackageServiceWithAcl>
  allPackageServices: Array<PackageServiceWithAcl>
  loading: boolean
  onSubmitPendingServices: () => void
  showCreditToggle: boolean
  packageSource?: PackageSource
  costMarginPercent: number
}

export const ProjectPackageBrowser = (props: ProjectPackageBrowserType) => {
  const { t } = useTranslation(['generic', 'service-checkout'])
  const packageBrowserContext = usePackageBrowser(props)

  const { onBack, showCredits, setShowCredits } = packageBrowserContext
  const toggleShowCredits = () => setShowCredits((prev) => !prev)

  return (
    <PackageBrowserProvider value={packageBrowserContext}>
      <SidebarLayoutContent>
        <PageHeader dataTestId="service-browser-page-header">
          <PageHeader.Main>
            <PageHeader.Overline>
              <PageHeader.OverlineLink onClick={onBack}>
                {t('back', { ns: 'generic' })}
              </PageHeader.OverlineLink>
            </PageHeader.Overline>
            <PageHeader.Title
              title={t('service-checkout:services.browser-heading')}
            />
            <PageHeader.Subtitle
              subtitle={
                <Stack gap="2" alignItems="start" justifyContent="start">
                  {t('service-checkout:services.browser-subheading')}
                  <ProjectPackageBrowserHeaderTooltip />
                </Stack>
              }
            />
          </PageHeader.Main>
          {showCredits && (
            <PageHeader.Controls>
              <CurrencyCreditToggle
                checked={showCredits}
                onChange={toggleShowCredits}
                dataTestId="project-package-browser-credit-toggle"
                dataTrackingId="project-package-browser-credit-toggle"
              />
            </PageHeader.Controls>
          )}
        </PageHeader>
        <TwoColumn>
          <TwoColumn.Main>
            <ProjectServices />
          </TwoColumn.Main>
          <TwoColumn.Aside>
            <ProjectPackageCheckout />
          </TwoColumn.Aside>
        </TwoColumn>
        <PackageCheckoutCancelModal />
      </SidebarLayoutContent>
    </PackageBrowserProvider>
  )
}
