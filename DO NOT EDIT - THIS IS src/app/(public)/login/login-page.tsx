'use client'

import Image from 'next/image'
import { useState } from 'react'

import { getAssetUrl } from '@mntn-dev/app-assets'
import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  CenteredLayout,
  Icon,
  Stack,
  Text,
} from '@mntn-dev/ui-components'

export const LoginPage = () => {
  const { t } = useTranslation('login')
  const { redirect_url } = useQueryParams<'/login'>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleButtonClick = () => {
    setLoading(true)

    router.push(route('/api/auth/logout').query({ redirect_url }))
  }

  return (
    <CenteredLayout>
      <Stack
        direction="row"
        gap="20"
        className="w-full max-w-screen-2xl lg:px-8 lg:py-10 mx-auto"
      >
        <Stack gap="8" direction="col" className="w-[500px] 2xl:w-auto">
          <Image
            src={getAssetUrl('quickframe-marketplace-logo')}
            alt=""
            width={433}
            height={149}
          />
          <Image
            src={getAssetUrl('powered-by-mntn-pass')}
            alt=""
            width={226}
            height={38}
          />
          <Text fontSize="base" className="text-left">
            QuickFrame Marketplace connects you with vetted video pros to bring
            your creative to life: quickly, affordably, and at scale. No
            agencies, no guesswork — just results.
          </Text>
          <Stack direction="col" gap="4">
            <Stack gap="4" className="items-center" direction="row">
              <Icon size="lg" color="brand" name="video" fill="solid" />
              <Text fontSize="base">{t('bullet.1')}</Text>
            </Stack>
            <Stack gap="4" className="items-center" direction="row">
              <Icon size="lg" color="brand" name="team" fill="solid" />
              <Text fontSize="base">{t('bullet.2')}</Text>
            </Stack>
            <Stack gap="4" className="items-center" direction="row">
              <Icon size="lg" color="brand" name="trophy" fill="solid" />
              <Text fontSize="base">{t('bullet.3')}</Text>
            </Stack>
          </Stack>

          <Button
            dataTestId="logout-button"
            dataTrackingId="logout-button"
            width="full"
            loading={loading}
            disabled={loading}
            type="button"
            onClick={handleButtonClick}
            iconRight="arrow-right"
          >
            {t('action.logout')}
          </Button>
        </Stack>

        <Stack className="flex-none">
          <Image
            src={getAssetUrl('quickframe-preview')}
            className="hidden 2xl:block"
            alt=""
            width={944}
            height={521}
          />
        </Stack>
      </Stack>
    </CenteredLayout>
  )
}
