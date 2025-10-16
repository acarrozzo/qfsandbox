'use client'

import type { ReactElement } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Heading, Stack, Text } from '@mntn-dev/ui-components'

import { Error403 } from '#components/error/images/error-403.tsx'
import { Error404 } from '#components/error/images/error-404.tsx'
import { Error500 } from '#components/error/images/error-500.tsx'

export type ErrorLayoutProps = { code?: 401 | 403 | 404 | 500 }

type ErrorDetails = {
  image: ReactElement
  heading: string
  description: string
  buttonText: string
}

export const ErrorLayout = ({ code = 500 }: ErrorLayoutProps) => {
  const { t } = useTranslation('error')
  const defaultErrorDetails: ErrorDetails = {
    image: Error500(),
    heading: t('500.heading'),
    description: t('500.description'),
    buttonText: t('500.buttonText'),
  }
  const errorDetailsMap: { [key: number]: ErrorDetails } = {
    401: {
      image: Error403(),
      heading: t('401.heading'),
      description: t('401.description'),
      buttonText: t('401.buttonText'),
    },
    403: {
      image: Error403(),
      heading: t('403.heading'),
      description: t('403.description'),
      buttonText: t('403.buttonText'),
    },
    404: {
      image: Error404(),
      heading: t('404.heading'),
      description: t('404.description'),
      buttonText: t('404.buttonText'),
    },
    500: defaultErrorDetails,
  }

  const router = useRouter()
  const errorDetails = errorDetailsMap[code] ?? defaultErrorDetails
  return (
    <Stack
      direction="col"
      alignItems="center"
      justifyContent="center"
      width="full"
      height="screen"
      gap="10"
    >
      {errorDetails.image}
      <Stack direction="col" alignItems="center" justifyContent="center">
        <Heading fontSize="displayXl">{code}</Heading>
        <Heading fontSize="3xl" textColor="brand">
          {errorDetails.heading}
        </Heading>
        <Text textColor="tertiary">{errorDetails.description}</Text>
      </Stack>
      <Button onClick={() => router.push(route('/dashboard'))}>
        {errorDetails.buttonText}
      </Button>
    </Stack>
  )
}
