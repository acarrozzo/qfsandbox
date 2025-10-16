'use client'

import { AppTrans } from '@mntn-dev/app-common'
import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import { logoutUrl, route } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Heading,
  HorizontalList,
  ModalCenteredHeaderIcon,
  Stack,
  Tag,
  Text,
} from '@mntn-dev/ui-components'

export const WelcomePage = () => {
  const { t } = useTranslation(['welcome'])
  const router = useRouter()
  const queryParams = useQueryParams<'/welcome'>()

  const handleBackClick = () => {
    router.pushUrl(logoutUrl(queryParams.returnTo))
  }

  const handleSignUpClick = () => {
    router.push(route('/signup').query(queryParams))
  }

  return (
    <Stack
      gap="8"
      direction="col"
      className="my-48 text-center items-center"
      width="144"
    >
      <Stack className="items-center" gap="4" direction="col">
        <ModalCenteredHeaderIcon name="nav-projects" />
        <Heading fontSize="4xl" className="-my-2">
          <AppTrans
            t={t}
            i18nKey="welcome:title"
            components={{
              br: <br />,
            }}
          />
        </Heading>
      </Stack>
      {process.env.NEXT_PUBLIC_MNTN_PASS === 'true' && (
        <Tag
          icon={{ fill: 'solid', name: 'shield-check' }}
          onDismiss={() => {}}
          shape="pill"
          size="lg"
          textTransform="none"
          type="brand"
          variant="tertiary"
        >
          {t('authenticated')}
        </Tag>
      )}
      <Stack gap="6" direction="col" className="items-center">
        <Text fontSize="sm" textColor="secondary">
          {t('welcome:subtitle')}
        </Text>
        <HorizontalList
          items={[
            t('welcome:bullet.1'),
            t('welcome:bullet.2'),
            t('welcome:bullet.3'),
          ]}
        />
      </Stack>
      <Stack gap="4" direction="col">
        <Button
          type="button"
          onClick={handleSignUpClick}
          width="full"
          className="px-8"
          iconRight="arrow-right"
        >
          {t('welcome:action.signup')}
        </Button>
        <Button
          type="button"
          onClick={handleBackClick}
          variant="text"
          iconLeft="arrow-left"
          size="sm"
        >
          {t('welcome:action.back')}
        </Button>
      </Stack>
    </Stack>
  )
}
