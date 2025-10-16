'use client'

import { useEffect, useState } from 'react'

import type { UserDomainQueryModel } from '@mntn-dev/domain-types'

import { identifyUser } from '~/utils/identify-user.ts'

import { useMe } from './use-me.ts'

/**
 * This hook will identify the current user to highlight.io
 * if the current user hasn't already been identified.
 */
export const useUserIdentifier = () => {
  const {
    me,
    me: { organization },
  } = useMe()

  const [lastIdentifiedUser, setLastIdentifiedUser] = useState<
    UserDomainQueryModel | null | undefined
  >(undefined)

  useEffect(() => {
    if (me && me !== lastIdentifiedUser) {
      identifyUser(me)
      setLastIdentifiedUser(me)
    }
  }, [me, lastIdentifiedUser])

  if (!organization) {
    throw new Error('Me is not in an organization.')
  }
}
