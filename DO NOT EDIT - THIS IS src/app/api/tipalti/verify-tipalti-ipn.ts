import { env } from '@mntn-dev/env'

export const dynamic = 'force-dynamic'

const EXPECTED_IPN_VERIFICATION_RESPONSE = 'VERIFIED'

export const verifyTipaltiIpn = async (body: string) => {
  const response = await fetch(env.TIPALTI_IPN_VERIFY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': `${body.length}`,
    },
    body,
  })

  const { status, statusText } = response

  if (!response.ok) {
    throw new Error(
      `Failed to verify tipalti ipn, status: ${status}, statusText: ${statusText}`
    )
  }

  const text = await response.text()

  if (text !== EXPECTED_IPN_VERIFICATION_RESPONSE) {
    throw new Error(
      `Failed to verify tipalti ipn, status: ${status}, statusText: ${statusText}, response: ${text}`
    )
  }
}
