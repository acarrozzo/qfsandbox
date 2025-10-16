import type { ServiceLike } from '@mntn-dev/domain-types'

export type ServiceFieldProps = {
  disabled: boolean
  readonly?: boolean
  service?: ServiceLike
  hide?: boolean
}
