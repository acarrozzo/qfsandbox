import { cookies, headers } from 'next/headers'
import { cache } from 'react'

import { getLanguage } from '@mntn-dev/i18n'

export const getServerLanguage = cache(async () =>
  getLanguage({ cookies: cookies(), headers: headers() })
)
