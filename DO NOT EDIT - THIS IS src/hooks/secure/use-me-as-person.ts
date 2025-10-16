import { useEffect, useState } from 'react'

import { userToPerson } from '@mntn-dev/app-common'
import type { Person } from '@mntn-dev/ui-components'

import { getAvatarUrl } from '~/components/avatar/helper.ts'

import { useMe } from './use-me.ts'

export function useMeAsPerson() {
  const { me } = useMe()
  const [meAsPerson, setMeAsPerson] = useState<Person>()

  useEffect(() => {
    const getPerson = () => {
      setMeAsPerson(userToPerson(me, getAvatarUrl))
    }
    getPerson()
  }, [me])

  return { meAsPerson }
}
