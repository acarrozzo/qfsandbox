import { FileIdSchema } from '@mntn-dev/domain-types'
import { ImageTransformationOptionsSchema } from '@mntn-dev/files-shared'

export const InputSchema = ImageTransformationOptionsSchema.extend({
  fileId: FileIdSchema,
})
