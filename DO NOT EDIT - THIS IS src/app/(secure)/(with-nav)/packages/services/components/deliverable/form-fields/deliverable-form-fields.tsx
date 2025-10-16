import { type FC, useMemo } from 'react'

import type { DeliverableCategory } from '@mntn-dev/domain-types'

import type { DeliverableFormFieldProps } from '../types.ts'
import { ArchiveDeliverableFormFields } from './archive-deliverable-form-fields.tsx'
import { FileDeliverableFormFields } from './file-deliverable-form-fields.tsx'
import { VideoDeliverableFormFields } from './video-deliverable-form-fields.tsx'

export const deliverableFormFieldMap: Record<
  DeliverableCategory,
  FC<DeliverableFormFieldProps>
> = {
  video: VideoDeliverableFormFields,
  file: FileDeliverableFormFields,
  archive: ArchiveDeliverableFormFields,
}

export const DeliverableFormFields = ({
  category,
  ...props
}: { category: DeliverableCategory } & DeliverableFormFieldProps) => {
  const Component = useMemo(() => deliverableFormFieldMap[category], [category])

  return <Component {...props} />
}
