import type { TFunction } from 'i18next'

import type { DeliverableDetails } from '@mntn-dev/domain-types'
import type { Control, FieldErrors } from '@mntn-dev/forms'

export type DeliverablesFragment<TDeliverables = Array<DeliverableDetails>> = {
  deliverables: TDeliverables
}

export type DeliverableFormFieldProps = {
  deliverableIndex: number
  control: Control<DeliverablesFragment>
  errors: FieldErrors<DeliverablesFragment>
  isTriggered: boolean
  isDisabled: boolean
  t: TFunction<['deliverable-details', 'validation', 'deliverable']>
}

export type DeliverableState = {
  index: number
  isNew: boolean
}
