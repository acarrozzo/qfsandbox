import { StatusCodes } from 'http-status-codes'
import type { NextRequest, NextResponse } from 'next/server'
import setCookieParser, { type Cookie } from 'set-cookie-parser'

import { route } from '@mntn-dev/app-routing'
import { env } from '@mntn-dev/env'
import {
  assertError,
  isPrincipalInactiveError,
  PrincipalInactiveError,
} from '@mntn-dev/errors'
import {
  PrincipalLogger,
  PrincipalSchema,
  PrincipalSessionCookie,
  type PrincipalSessionCookieName,
} from '@mntn-dev/session'
import { validateJson } from '@mntn-dev/utilities'

import { FetchPrincipalResponseSchema } from '~/app/api/auth/principal/types'
import { apiOrigin } from '~/utils/request.ts'

const principalRoute = route('/api/auth/principal')

const doFetch = ({
  req: { headers },
  req,
  token,
}: {
  req: NextRequest
  token?: string | null
}) => {
  if (env.NEXT_PUBLIC_MNTN_PASS) {
    return fetch(principalRoute.toAbsoluteUrl(apiOrigin(req)), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return fetch(`${apiOrigin(req)}/api/auth/principal`, {
    headers: { cookie: headers.get('cookie') ?? '' },
  })
}

export async function fetchPrincipal({
  req,
  res,
  token,
  emailAddress,
}: {
  req: NextRequest
  res: NextResponse
  token?: string | null
  emailAddress: string
}) {
  try {
    // First try to get the principal from the PrincipalSession cookie and return it if it exists.
    // Otherwise get a fresh principal from GET /api/auth/principal, which also sets the PrincipalSession cookie.

    const principal = await PrincipalSessionCookie.get(emailAddress)

    if (principal && PrincipalSchema.safeParse(principal).success) {
      PrincipalLogger.info('Using principal found in PrincipalSessionCookie.', {
        userId: principal.profile.userId,
      })
      return principal
    }

    // Fetch the principal from the API route

    PrincipalLogger.info(
      'Principal was not found in PrincipalSessionCookie. Fetching principal from API.',
      {
        route: principalRoute.pattern,
      }
    )

    const response = await doFetch({ req, token })

    if (response.status === StatusCodes.NOT_FOUND) {
      PrincipalLogger.info(
        `Principal fetch returned NOT_FOUND for ${emailAddress}.`,
        {
          route: principalRoute.pattern,
        }
      )
      return null
    }

    if (response.status === StatusCodes.PRECONDITION_FAILED) {
      throw new PrincipalInactiveError(
        `Principal fetch returned PRECONDITION_FAILED (inactive principal) for ${emailAddress}.`
      )
    }

    if (!response.ok) {
      const responseBody = await response.text()
      throw new Error(
        `Unexpected error encountered fetching principal. Status: ${response.status} ${response.statusText}, Body: ${responseBody}`
      )
    }

    // Transfer the PrincipalSession cookie from the fetch response to the NextResponse

    PrincipalLogger.info(
      'Principal successfully fetched. Transfering PrincipalSession cookie from the fetch response to the NextResponse.'
    )

    const {
      __principal: { name, value },
    }: {
      [K in PrincipalSessionCookieName]: Cookie
    } = setCookieParser.parse(response.headers.getSetCookie(), {
      map: true,
    }) as unknown as { [K in PrincipalSessionCookieName]: Cookie }

    res.cookies.set(name, value)

    return validateJson(await response.text(), FetchPrincipalResponseSchema)
  } catch (error) {
    if (isPrincipalInactiveError(error)) {
      throw error
    }

    assertError(error)

    PrincipalLogger.error('Unexpected error occurred fetching principal', {
      error: error.message,
    })

    return null
  }
}
