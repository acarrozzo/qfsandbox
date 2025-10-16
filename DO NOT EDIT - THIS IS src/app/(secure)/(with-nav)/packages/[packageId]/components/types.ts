import type {
  AddPackageServiceInput,
  CreatePackageInput,
} from '@mntn-dev/package-service/client'

export type PartialCreatePackageInput = Pick<
  CreatePackageInput,
  'name' | 'description' | 'cost' | 'packageSource'
>

export type CorePackageServiceInput = Pick<
  AddPackageServiceInput,
  'serviceType' | 'count' | 'cost'
>
