'use client'

import { useState } from 'react'

import type { SignUpModel } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { SignUpComplete } from './components/sign-up-complete.tsx'
import { SignUpForm } from './components/sign-up-form.tsx'

export const SignUpPage = () => {
  const {
    mutateAsync: signUp,
    isPending,
    isSuccess,
  } = trpcReactClient.public.signUp.useMutation()

  const [registration, setRegistration] = useState<SignUpModel | undefined>(
    undefined
  )

  const handleSubmit = async (registration: SignUpModel) => {
    await signUp(registration)
    setRegistration(registration)
  }

  return registration ? (
    <SignUpComplete registration={registration} />
  ) : (
    <SignUpForm isSaving={isPending || isSuccess} onSubmit={handleSubmit} />
  )
}
