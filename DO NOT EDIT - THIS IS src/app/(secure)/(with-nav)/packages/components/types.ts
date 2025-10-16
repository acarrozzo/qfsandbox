import type { TupleToUnion } from 'type-fest'

export const primaryPackageStatusTabKeys = [
  'all',
  'published',
  'draft',
] as const
export const secondaryPackageStatusTabKeys = ['archived'] as const
export const packageStatusTabKeys = [
  ...primaryPackageStatusTabKeys,
  ...secondaryPackageStatusTabKeys,
] as const
export type PackageStatusTabKey = TupleToUnion<typeof packageStatusTabKeys>
