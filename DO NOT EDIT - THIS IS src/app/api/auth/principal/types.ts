import { PrincipalSchema } from '@mntn-dev/session-types'
import type { ZodInfer } from '@mntn-dev/utility-types'

export const FetchPrincipalResponseSchema = PrincipalSchema

export type FetchPrincipalResponse = ZodInfer<
  typeof FetchPrincipalResponseSchema
>
