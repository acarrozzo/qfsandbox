'use client'

import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { SignUpModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Heading, Icon, Stack, Text } from '@mntn-dev/ui-components'

import { useUnauthenticatedSession } from '~/hooks/secure/use-unauthenticated-session.ts'

type SignUpCompleteProps = {
  registration: SignUpModel
}

export const SignUpComplete = ({
  registration: {
    user: { firstName },
  },
}: SignUpCompleteProps) => {
  const { t } = useTranslation(['account-registration'])
  const router = useRouter()
  const { returnTo } = useQueryParams<'/signup'>()
  const { authn } = useUnauthenticatedSession()

  const handleRedirectClick = () => {
    if (authn) {
      router.pushUrl(returnTo || route('/dashboard').toRelativeUrl())
    } else {
      router.push(route('/dashboard'))
    }
  }

  return (
    <Stack gap="4" direction="col" className="my-48 text-center">
      <Stack gap="2" direction="col">
        <Icon
          size="3xl"
          name="checkbox-circle"
          className="m-auto drop-shadow-glow-blue-light"
          color="positive"
        />
        <Heading fontSize="2xl" textColor="positive">
          {t('account-registration:complete.label')}
        </Heading>
      </Stack>
      <Heading fontSize="4xl" className="my-2">
        {t('account-registration:complete.title', { firstName })}
      </Heading>
      <Stack className="-mt-6 items-center" gap="6" direction="col">
        <Text fontSize="lg" textColor="secondary">
          {t('account-registration:complete.subtitle')}
        </Text>
        <Button
          dataTestId="account-registration-complete-button"
          dataTrackingId="account-registration-complete-button"
          type="button"
          onClick={handleRedirectClick}
          width="fit"
          className="px-8"
          iconRight="arrow-right"
        >
          {t('account-registration:complete.action.cta')}
        </Button>
      </Stack>
    </Stack>
  )
}
