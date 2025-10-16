'use client'

import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push(route('/dashboard'))
  }, [router])

  return null
}
