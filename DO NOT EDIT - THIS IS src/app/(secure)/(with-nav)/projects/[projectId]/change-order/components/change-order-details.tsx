'use client'

import { useEffect, useMemo, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type {
  PackageServiceDomainSelectModel,
  PackageServiceId,
  ProjectDomainSelectModel,
  ProjectId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  PageHeader,
  SidebarLayoutContent,
  Stack,
  StickyDiv,
  useToast,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useBreadcrumbs } from '~/components/breadcrumbs/index.ts'
import { RouteBreadcrumbs } from '~/components/breadcrumbs/route-breadcrumbs.tsx'
import { TwoColumn } from '~/components/layout/two-column/two-column.tsx'
import { useRefetchProject } from '~/components/projects/use-refetch-project.ts'
import { useRefetchProjectServices } from '~/components/services/use-refetch-project-services.ts'

import type { ChangeOrderPackageServiceFormModel } from '../types.ts'
import ChangeOrderPackageServiceDetails from './change-order-package-service-details.tsx'
import { ServiceBlade } from './service-blade.tsx'

const filterServices =
  (project: ProjectDomainSelectModel) =>
  (service: PackageServiceDomainSelectModel) => {
    if (service.serviceKey === 'pre_production_review_round') {
      return project.status === 'pre_production'
    }

    return true
  }

export const ChangeOrderDetails = ({ projectId }: { projectId: ProjectId }) => {
  const { t } = useTranslation(['generic', 'change-order', 'toast'])
  const router = useRouter()
  const { showToast } = useToast()
  const refetchProject = useRefetchProject()
  const refetchProjectServices = useRefetchProjectServices({ projectId })

  const [selectedPackageServiceId, setSelectedPackageServiceId] = useState<
    PackageServiceId | undefined
  >(undefined)

  const handleServiceBladeClick =
    ({ packageServiceId }: PackageServiceDomainSelectModel) =>
    () => {
      setSelectedPackageServiceId(packageServiceId)
    }

  const [{ project }] = trpcReactClient.projects.get.useSuspenseQuery(projectId)

  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/projects/:projectId': project.name,
    })
    return () => setBreadcrumbTokens({})
  }, [project, setBreadcrumbTokens])

  const [{ services }] =
    trpcReactClient.packages.getPackageDetails.useSuspenseQuery({
      packageKey: 'change_order_package',
    })

  if (!services) {
    throw new Error('No services found on Change Order Package.')
  }

  const filteredServices = useMemo(
    () => services.filter(filterServices(project)),
    [services, project]
  )

  const selectedPackageService = useMemo(
    () =>
      filteredServices.find(
        (service) => service.packageServiceId === selectedPackageServiceId
      ),
    [filteredServices, selectedPackageServiceId]
  )

  const { mutateAsync: addProjectChangeOrder, isPending: isAddingChangeOrder } =
    trpcReactClient.projects.addProjectChangeOrder.useMutation()

  const handlePackageServiceUpdate = async (
    value: ChangeOrderPackageServiceFormModel
  ) => {
    const { notes, ...service } = value

    await addProjectChangeOrder({ projectId, service, notes })

    await Promise.all([refetchProject({ projectId }), refetchProjectServices()])

    showToast.info({
      title: t('toast:project.change-order-added.title'),
      body: t('toast:project.change-order-added.body'),
      dataTestId: 'project-change-order-added-info-toast',
      dataTrackingId: 'project-change-order-added-info-toast',
    })

    router.push(route('/projects/:projectId').params({ projectId }))
  }

  const handlePackageServiceCancel = () => {
    setSelectedPackageServiceId(undefined)
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
              onClick={() =>
                router.push(route('/projects/:projectId').params({ projectId }))
              }
            >
              {t('back', { ns: 'generic' })}
            </PageHeader.OverlineLink>
            <PageHeader.OverlineDivider />
            <PageHeader.OverlineBreadcrumbs
              crumbs={RouteBreadcrumbs({
                options: {
                  includeSelf: false,
                  depth: 2,
                },
              })}
            />
          </PageHeader.Overline>
          <PageHeader.Title title={t('change-order:title')} />
        </PageHeader.Main>
      </PageHeader>
      <TwoColumn>
        <TwoColumn.Main>
          <Stack gap="4" direction="col" height="full">
            {filteredServices.map((service) => (
              <ServiceBlade
                key={service.packageServiceId}
                service={service}
                isSelected={
                  service.packageServiceId === selectedPackageServiceId
                }
                scroll={service.packageServiceId === selectedPackageServiceId}
                onClick={handleServiceBladeClick(service)}
              />
            ))}
          </Stack>
        </TwoColumn.Main>
        <TwoColumn.Aside>
          <StickyDiv marginY="8">
            <ChangeOrderPackageServiceDetails
              isBusy={isAddingChangeOrder}
              isUpdating={isAddingChangeOrder}
              isReadonly={false}
              packageService={selectedPackageService}
              onPackageServiceUpdate={handlePackageServiceUpdate}
              project={project}
              onCancel={handlePackageServiceCancel}
            />
          </StickyDiv>
        </TwoColumn.Aside>
      </TwoColumn>
    </SidebarLayoutContent>
  )
}
