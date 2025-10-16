import { StatusCodes } from 'http-status-codes'

import { AuthenticationLogger } from '@mntn-dev/authentication-server'
import { assertError } from '@mntn-dev/errors'
import { PublicService } from '@mntn-dev/public-service'
import { PrincipalLogger, PrincipalSessionCookie } from '@mntn-dev/session'
import { assertOk } from '@mntn-dev/utilities'

import { getAuthClaims } from '~/utils/auth-helpers.ts'
import { getRequestDetails } from '~/utils/request.ts'

export const GET = async (req: Request) => {
  // Clear any pre-existing session cookie. It will get re-written later in this request if the principal is valid.
  await PrincipalSessionCookie.clear()

  const claims = await getAuthClaims(req)

  if (!claims) {
    PrincipalLogger.error(
      'Claims not found when extracting authentication information',
      {
        request: getRequestDetails(req),
      }
    )

    return new Response(null, {
      status: StatusCodes.UNAUTHORIZED,
    })
  }

  try {
    if (!claims.primary_email) {
      PrincipalLogger.info('The primary_email claim is not present', {
        request: getRequestDetails(req),
      })

      return new Response('Missing primary_email claim', {
        status: StatusCodes.BAD_REQUEST,
      })
    }

    const principal = assertOk(
      await PublicService().getPrincipal({
        emailAddress: claims.primary_email,
      })
    )

    if (principal === null) {
      PrincipalLogger.warn('Could not find principal by email address', {
        emailAddress: claims.primary_email,
      })

      return Response.json(null, { status: StatusCodes.NOT_FOUND })
    }

    if (principal.authz.isActive === false) {
      PrincipalLogger.warn('Principal is disabled', {
        emailAddress: claims.primary_email,
        request: getRequestDetails(req),
      })

      return Response.json(null, { status: StatusCodes.PRECONDITION_FAILED })
    }

    try {
      // Set the principal to the PrincipalSessionCookie which will be parsed on the other side of this request.
      await PrincipalSessionCookie.set(principal)
    } catch {
      AuthenticationLogger.error(
        'An unexpected error occurred while setting PrincipalSessionCookie',
        {
          principal,
          request: getRequestDetails(req),
        }
      )
    }

    return Response.json(principal, { status: StatusCodes.OK })
  } catch (error) {
    assertError(error)

    AuthenticationLogger.error(
      'Unexpected error occurred while processing principal request',
      {
        error: error.message,
        request: getRequestDetails(req),
      }
    )

    return new Response(null, {
      status: StatusCodes.UNAUTHORIZED,
    })
  }
}
