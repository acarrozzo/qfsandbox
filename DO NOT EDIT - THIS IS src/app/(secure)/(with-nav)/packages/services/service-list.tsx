'use client'

import { useMemo, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { type ServiceId, servicesByStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { ServiceDomainQueryModelWithAcl } from '@mntn-dev/package-service/client'
import {
  Button,
  LoadingOverlay,
  PageHeader,
  SidebarLayoutContent,
  Stack,
  StickyDiv,
  useOpenState,
} from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { EmptyState } from '~/components/empty/index.ts'
import { SingleColumn } from '~/components/layout/single-column/single-column.tsx'
import { TwoColumn } from '~/components/layout/two-column/two-column.tsx'
import { useTabs } from '~/components/tabs/tabs-provider.tsx'

import { ServiceBlade } from './components/service-blade.tsx'
import { ServiceCreateModal } from './components/service-create-modal.tsx'
import ServiceDetails from './components/service-details.tsx'
import { ServiceStatusTabs } from './components/service-status-tabs.tsx'
import type {
  PartialCreateServiceInput,
  ServiceStatusTabKey,
} from './components/types.ts'

export const ServiceList = () => {
  const { t } = useTranslation(['service-list', 'generic'])
  const router = useRouter()

  const { currentTab } = useTabs<ServiceStatusTabKey>()

  const [selectedServiceId, setSelectedServiceId] = useState<
    ServiceId | undefined
  >(undefined)

  const handleServiceBladeClick =
    ({ serviceId }: ServiceDomainQueryModelWithAcl) =>
    () => {
      setSelectedServiceId(serviceId)
    }

  const [data, { refetch, isRefetching }] =
    trpcReactClient.packages.getAllServices.useSuspenseQuery()

  const services = useMemo(
    () =>
      data.filter(
        servicesByStatus(
          currentTab === 'all' ? ['draft', 'published'] : [currentTab]
        )
      ),
    [data, currentTab]
  )

  const handleServiceUpdated = async () => {
    await refetch()
  }

  const handleCreateServiceButtonClick = () => {
    onModalToggle()
  }

  const {
    onClose: onModalClose,
    onToggle: onModalToggle,
    open: modalOpen,
  } = useOpenState()

  const selectedService = useMemo(
    () => services.find((service) => service.serviceId === selectedServiceId),
    [services, selectedServiceId]
  )

  const { mutateAsync: createService, isPending: isServiceCreating } =
    trpcReactClient.packages.createService.useMutation()

  const handleCreateService = async (service: PartialCreateServiceInput) => {
    const { serviceId } = await createService(service)
    await refetch()
    setSelectedServiceId(serviceId)
    onModalClose()
  }

  return (
    <SidebarLayoutContent>
      <PageHeader
        dataTestId="service-list-page-header"
        dataTrackingId="service-list-page-header"
      >
        <PageHeader.Main>
          <PageHeader.Overline>
            <PageHeader.OverlineLink
              onClick={() => router.push(route('/packages'))}
            >
              {t('back', { ns: 'generic' })}
            </PageHeader.OverlineLink>
          </PageHeader.Overline>
          <PageHeader.Title title={t('title')} />
        </PageHeader.Main>
      </PageHeader>
      <Stack width="full" direction="col" className="mb-8">
        <Stack
          justifyContent="between"
          width="full"
          wrap="wrap"
          gap="8"
          alignItems="center"
        >
          <ServiceStatusTabs />
          <div className="grow" />
          <Button variant="secondary" onClick={handleCreateServiceButtonClick}>
            {t('action.create')}
          </Button>
          <ServiceCreateModal
            open={modalOpen}
            onClose={onModalClose}
            onCreate={handleCreateService}
            isCreating={isServiceCreating}
          />
        </Stack>
      </Stack>
      {isNonEmptyArray(services) ? (
        <TwoColumn>
          <TwoColumn.Main columnSpan={6}>
            {isRefetching && <LoadingOverlay />}
            <Stack gap="4" direction="col" height="full">
              {services.map((service) => (
                <ServiceBlade
                  key={service.serviceId}
                  service={service}
                  isSelected={service.serviceId === selectedServiceId}
                  scroll={service.serviceId === selectedServiceId}
                  onClick={handleServiceBladeClick(service)}
                />
              ))}
            </Stack>
          </TwoColumn.Main>
          <TwoColumn.Aside columnSpan={5}>
            <StickyDiv marginY="8">
              <ServiceDetails
                key={selectedServiceId}
                service={selectedService}
                onServiceUpdated={handleServiceUpdated}
              />
            </StickyDiv>
          </TwoColumn.Aside>
        </TwoColumn>
      ) : (
        <SingleColumn>
          <EmptyState id="service-list">
            <EmptyState.NothingToSee />
          </EmptyState>
        </SingleColumn>
      )}
    </SidebarLayoutContent>
  )
}
