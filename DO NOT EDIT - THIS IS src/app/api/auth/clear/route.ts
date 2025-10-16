export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { tryLogout } from '@mntn-dev/authentication-server'
import { env } from '@mntn-dev/env'

import { clearCookies } from '../utils.ts'

export const GET = async () => {
  if (env.NEXT_PUBLIC_MNTN_PASS) {
    await tryLogout()
  }
  return clearCookies(NextResponse.json({}))
}
