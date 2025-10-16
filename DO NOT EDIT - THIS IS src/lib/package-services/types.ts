import type { PackageServiceWithAcl } from '@mntn-dev/project-service'

export type PackageServiceLike = Pick<
  PackageServiceWithAcl,
  'packageServiceId' | 'serviceId'
>
