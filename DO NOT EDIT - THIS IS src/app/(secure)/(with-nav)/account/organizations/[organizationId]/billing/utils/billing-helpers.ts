import type {
  DefaultPaymentMethod,
  PaymentMethodListItem,
} from '@mntn-dev/billing/types'

export const sortedPaymentMethods = (
  paymentMethods: PaymentMethodListItem[],
  defaultMethodId?: DefaultPaymentMethod
) => {
  return paymentMethods
    .slice()
    .sort((a: PaymentMethodListItem, b: PaymentMethodListItem) => {
      // Move the default payment method to the top
      if (defaultMethodId) {
        if (a.id === defaultMethodId) {
          return -1
        }

        if (b.id === defaultMethodId) {
          return 1
        }
      }

      // Otherwise, sort by creation timestamp
      return a.created && b.created ? a.created - b.created : 0
    })
}
