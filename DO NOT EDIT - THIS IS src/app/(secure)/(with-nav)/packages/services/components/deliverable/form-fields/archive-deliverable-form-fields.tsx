import type { FC } from 'react'

import { CommonDeliverableFields } from '~/app/(secure)/(with-nav)/packages/services/components/deliverable/form-fields/common-deliverable-form-fields.tsx'

import type { DeliverableFormFieldProps } from '../types.ts'

export const ArchiveDeliverableFormFields: FC<DeliverableFormFieldProps> = (
  props
) => (
  <>
    <CommonDeliverableFields {...props} />
  </>
)
