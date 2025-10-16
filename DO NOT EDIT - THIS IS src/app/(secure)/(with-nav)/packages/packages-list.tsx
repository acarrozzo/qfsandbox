'use client'

import { useMemo, useState } from 'react'

import { type PackageId, packagesByStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'

import '@mntn-dev/ui-components'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { PackageDomainQueryModelWithAcl } from '@mntn-dev/package-service/client'
import {
  Button,
  LoadingOverlay,
  ResponsiveGridLayout,
  SidebarLayoutContent,
  Stack,
  useOpenState,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { EmptyState } from '~/components/empty/index.ts'
import { PageHeader } from '~/components/layout/headers/page-header.tsx'
import { SingleColumn } from '~/components/layout/single-column/single-column.tsx'
import { PackageCard } from '~/components/package/index.ts'
import { useTabs } from '~/components/tabs/index.ts'

import { PackageCreateModal } from './[packageId]/components/package-create-modal.tsx'
import type { PartialCreatePackageInput } from './[packageId]/components/types.ts'
import { PackageStatusTabs } from './components/package-status-tabs.tsx'
import type { PackageStatusTabKey } from './components/types.ts'
import { useRefreshPackage } from './hooks/use-refresh-package.ts'

type PackageListProps = {
  initialData: PackageDomainQueryModelWithAcl[]
}

export const PackageList = ({ initialData }: PackageListProps) => {
  const { t } = useTranslation(['package-list', 'generic'])
  const router = useRouter()

  const { currentTab } = useTabs<PackageStatusTabKey>()

  const [activePackageId] = useState<PackageId | null>(null)

  const { data, isRefetching } =
    trpcReactClient.packages.getAllPackages.useQuery({}, { initialData })

  const packages = useMemo(
    () =>
      data.filter(
        packagesByStatus(
          currentTab === 'all' ? ['draft', 'published'] : [currentTab]
        )
      ),
    [data, currentTab]
  )

  const handlePackageSelected = (packageId: PackageId) => () => {
    router.push(route('/packages/:packageId').params({ packageId }))
  }

  const handleServicesButtonClicked = () => {
    router.push(route('/packages/services'))
  }

  const {
    onClose: onModalClose,
    onToggle: onModalToggle,
    open: modalOpen,
  } = useOpenState()

  const { mutateAsync: createPackage, isPending: isPackageCreating } =
    trpcReactClient.packages.createPackage.useMutation()

  const refreshPackage = useRefreshPackage()

  const handleCreatePackage = async (pkg: PartialCreatePackageInput) => {
    const createdPackage = await createPackage(pkg)

    router.push(route('/packages/:packageId').params(createdPackage))

    await refreshPackage(createdPackage)
  }

  const handleCreateButtonClicked = () => {
    onModalToggle()
  }

  return (
    <SidebarLayoutContent>
      <PageHeader
        title={t('title')}
        dataTestId="packages-page-header"
        dataTrackingId="packages-page-header"
      />
      <SingleColumn>
        {isRefetching && <LoadingOverlay />}
        <Stack justifyContent="between" width="full" wrap="wrap" gap="6">
          <PackageStatusTabs />
          <div className="grow" />
          <Button variant="secondary" onClick={handleServicesButtonClicked}>
            {t('action.services')}
          </Button>
          <Button variant="primary" onClick={handleCreateButtonClicked}>
            {t('action.create')}
          </Button>
          <PackageCreateModal
            open={modalOpen}
            onClose={onModalClose}
            onCreate={handleCreatePackage}
            isCreating={isPackageCreating}
          />
        </Stack>
        {packages && packages.length > 0 ? (
          <ResponsiveGridLayout childSize="lg" gap="12">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.packageId}
                activePackageId={activePackageId}
                pkg={pkg}
                onPackageClicked={handlePackageSelected(pkg.packageId)}
                priceContext="agency"
              />
            ))}
          </ResponsiveGridLayout>
        ) : (
          <EmptyState id="package-list">
            <EmptyState.NothingToSee />
          </EmptyState>
        )}
      </SingleColumn>
    </SidebarLayoutContent>
  )
}
