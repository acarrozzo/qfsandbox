import { cache } from 'react'

import { getTranslation } from '@mntn-dev/i18n'

import { getServerLanguage } from './get-server-language.ts'

type NS = Parameters<typeof getTranslation>[1]

export const getServerTranslation = cache(async (ns: NS) => {
  const lng = await getServerLanguage()
  const result = await getTranslation(lng, ns)
  return result
})
