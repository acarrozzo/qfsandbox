import type { NextRequest } from 'next/server'

import { findRoute } from '@mntn-dev/app-routing'

export const shouldAuthenticate = (req: NextRequest) => {
  const {
    method,
    nextUrl: { pathname },
  } = req

  const currentRoute = findRoute(pathname, false)

  // Skip authentication for certain methods

  if (['OPTIONS', 'HEAD'].includes(method)) {
    return false
  }

  // Skip authentication for unprotected routes

  if (!currentRoute?.isProtected) {
    return false
  }

  return true
}
