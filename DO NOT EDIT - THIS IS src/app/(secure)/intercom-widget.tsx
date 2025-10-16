'use client'

import Intercom from '@intercom/messenger-js-sdk'

import { env } from '@mntn-dev/env'
import { useFlags } from '@mntn-dev/flags-client'

import { useMe } from '~/hooks/secure/use-me.ts'

const IntercomWidget = () => {
  const { me } = useMe()
  const { showIntercomWidget } = useFlags()

  if (me) {
    Intercom({
      app_id: env.NEXT_PUBLIC_INTERCOM_APP_ID,
      user_id: me.userId,
      name: me.displayName,
      email: me.emailAddress,
      userType:
        me.organizationType === 'agency' ? 'maker' : me.organizationType,
      created_at: Math.floor(me.signUpTimestamp.getTime() / 1000),
      hide_default_launcher: !showIntercomWidget,
    })
  }

  return null
}

export default IntercomWidget
