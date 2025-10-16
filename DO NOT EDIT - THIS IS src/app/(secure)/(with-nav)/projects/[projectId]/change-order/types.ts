import { AddProjectChangeOrderInputSchema } from '@mntn-dev/project-service'
import type { ZodInfer } from '@mntn-dev/utility-types'

export const ChangeOrderPackageServiceFormModelSchema =
  AddProjectChangeOrderInputSchema.shape.service.merge(
    AddProjectChangeOrderInputSchema.pick({ notes: true })
  )

export type ChangeOrderPackageServiceFormModel = ZodInfer<
  typeof ChangeOrderPackageServiceFormModelSchema
>
