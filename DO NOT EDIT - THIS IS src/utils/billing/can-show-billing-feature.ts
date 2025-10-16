import 'server-only'

import type { UserDomainQueryModel } from '@mntn-dev/domain-types'
import { env } from '@mntn-dev/env'
import { createFlagService } from '@mntn-dev/flags-server'
import { assert } from '@mntn-dev/utilities'

export const canShowBillingFeature = async (user?: UserDomainQueryModel) => {
  assert(user, 'User unknown in canShowBillingFeature')

  const flags = await createFlagService(env.LAUNCHDARKLY_SDK_KEY)
  const billingFeatureOn = await flags.serverFlag('billing', user.emailAddress)
  const result = user.organizationType === 'brand' && billingFeatureOn
  return result
}
