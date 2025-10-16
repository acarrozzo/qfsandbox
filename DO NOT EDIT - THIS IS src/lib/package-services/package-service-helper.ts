import type { ServiceId } from '@mntn-dev/domain-types'
import { groupBy } from '@mntn-dev/utilities'

import type { PackageServiceLike } from './types.ts'

export const packageServiceIdMap = (packageService: PackageServiceLike) =>
  packageService.packageServiceId

export const groupPackageServicesByServiceId = (
  packageServices: PackageServiceLike[]
) => groupBy(packageServices, 'serviceId')

export const findPackageServiceIdsForServiceInPackageServices = ({
  serviceId,
  packageServices,
}: {
  serviceId: ServiceId
  packageServices: PackageServiceLike[]
}) =>
  (groupPackageServicesByServiceId(packageServices)[serviceId] ?? []).map(
    packageServiceIdMap
  )
