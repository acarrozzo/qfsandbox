import * as cookie from 'cookie'
import type { NextRequest } from 'next/server'

import { env } from '~/env.js'

export const getNextRequestDetails = ({
  headers,
  nextUrl: { href },
  method,
}: NextRequest) => ({
  method,
  // headers: Object.fromEntries(headers.entries()),
  cookies: cookie.parse(headers.get('cookie') ?? ''),
  url: href,
})

export const getRequestDetails = ({ headers, method, url }: Request) => ({
  method,
  //headers: Object.fromEntries(headers.entries()),
  cookies: cookie.parse(headers.get('cookie') ?? ''),
  url,
})

const isLocalhost = ({ nextUrl: { hostname } }: NextRequest) =>
  hostname === 'localhost'

/**
 * USE ONLY FOR M2M REQUESTS TO OWN API
 * Get an origin string from a next request, with custom handling for localhost.
 *
 * Our local.magicsky.dev reverse proxy forwards requests to http://localhost:3005,
 * which works fine when going through the browser. For internal fetches, however,
 * we have two paths:
 *
 * 1. Use https://local.magicsky.dev as the origin. This is straightforward, but
 *    requires managing TLS certificates that we don’t want to distribute locally.
 *
 * 2. Use http://localhost:3005 directly. The challenge is that in this case
 *    Next.js reports req.nextUrl.origin as https://localhost, which is inaccurate
 *    for our setup. To avoid this mismatch, we reconstruct the expected
 *    http://localhost:3005 origin explicitly when the hostname is localhost.
 */
export const apiOrigin = (req: NextRequest) => {
  const {
    nextUrl: { hostname, port, origin },
  } = req
  return isLocalhost(req) ? `http://${hostname}:${port}` : origin
}

/** Get just the local path + query string params of the request. E.g., /foo?bar=baz */
export const pathAndQuery = ({ nextUrl: { pathname, search } }: NextRequest) =>
  `${pathname}${search}`

/** Get the fully qualified URL of the request but with an origin from env.APP_BASE_URL  */
export const appBaseUrl = (req: NextRequest) =>
  new URL(pathAndQuery(req), env.APP_BASE_URL).toString()
