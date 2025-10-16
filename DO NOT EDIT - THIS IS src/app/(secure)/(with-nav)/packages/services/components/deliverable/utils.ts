import type { DeliverableDetails } from '@mntn-dev/domain-types'
import type { FieldErrors } from '@mntn-dev/forms'

import type { DeliverablesFragment } from './types.ts'

export function isDeliverableErrors<TDeliverables = Array<DeliverableDetails>>(
  errors: FieldErrors<DeliverablesFragment<TDeliverables>>
): errors is FieldErrors<DeliverablesFragment<TDeliverables>> {
  return errors !== undefined
}
