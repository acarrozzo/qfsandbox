import 'server-only'

import type { UserDomainQueryModel } from '@mntn-dev/domain-types'
import { env } from '@mntn-dev/env'
import { createFlagService } from '@mntn-dev/flags-server'
import { assert } from '@mntn-dev/utilities'

export const canShowPaymentFeature = async (user?: UserDomainQueryModel) => {
  assert(user, 'User unknown in canShowPaymentFeature')

  const flags = await createFlagService(env.LAUNCHDARKLY_SDK_KEY)
  const paymentsFeatureOn = await flags.serverFlag(
    'payments',
    user.emailAddress
  )
  const result = user.organizationType === 'agency' && paymentsFeatureOn
  return result
}
