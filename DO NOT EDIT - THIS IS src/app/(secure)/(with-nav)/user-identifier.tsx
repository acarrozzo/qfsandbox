'use client'

import { useUserIdentifier } from '~/hooks/secure/use-user-identifier'

/**
 * A component wrapper around the useUserIdentifier hook
 * that can be added to a layout file to identify the
 * current user to hightlight.io
 */
export default function UserIdentifier() {
  useUserIdentifier()
  return null
}
