import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

export const clearCookies = (response: NextResponse) => {
  for (const cookie of cookies().getAll()) {
    response.cookies.set(cookie.name, '', {
      path: '/',
      maxAge: 0,
    })
  }

  return response
}
