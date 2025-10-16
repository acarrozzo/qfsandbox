import type { TupleToUnion } from 'type-fest'

import type { CreateServiceInput } from '@mntn-dev/package-service/client'

export type PartialCreateServiceInput = Pick<
  CreateServiceInput,
  'name' | 'description'
>

export const primaryServiceStatusTabKeys = [
  'all',
  'published',
  'draft',
] as const
export const secondaryServiceStatusTabKeys = ['archived'] as const
export const serviceStatusTabKeys = [
  ...primaryServiceStatusTabKeys,
  ...secondaryServiceStatusTabKeys,
] as const
export type ServiceStatusTabKey = TupleToUnion<typeof serviceStatusTabKeys>
