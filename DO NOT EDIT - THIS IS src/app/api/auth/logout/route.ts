import { type NextRequest, NextResponse } from 'next/server'

import { authCallbackUrl, route } from '@mntn-dev/app-routing'
import { auth, clerkClient } from '@mntn-dev/authentication-server'
import { env } from '@mntn-dev/env'

import { clearCookies } from '../utils.ts'

export const GET = async ({ nextUrl: { searchParams } }: NextRequest) => {
  if (env.NEXT_PUBLIC_MNTN_PASS) {
    const { sessionId, redirectToSignIn } = await auth()

    if (sessionId) {
      const client = await clerkClient()
      await client.sessions.revokeSession(sessionId)
    }

    // When explicitly logging out, skip over the login page and go straight to MNTN Pass
    await redirectToSignIn({
      returnBackUrl: searchParams.get('redirect_url') || authCallbackUrl(),
    })
  } else {
    return clearCookies(
      NextResponse.redirect(
        route('/login')
          .query({
            redirect_url: searchParams.get('redirect_url') || authCallbackUrl(),
          })
          .toAbsoluteUrl(),
        {
          status: 307,
        }
      )
    )
  }
}
