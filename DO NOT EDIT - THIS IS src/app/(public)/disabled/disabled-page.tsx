'use client'

import { AppTrans } from '@mntn-dev/app-common'
import { useRouter } from '@mntn-dev/app-navigation'
import { logoutUrl } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Heading,
  ModalCenteredHeaderIcon,
  Stack,
  Text,
} from '@mntn-dev/ui-components'

const support = 'pexsupport@quickframe.com'

export const DisabledPage = () => {
  const { t } = useTranslation(['disabled'])
  const router = useRouter()

  const handleBackClick = () => {
    router.pushUrl(logoutUrl())
  }

  const handleContactClick = () => {
    window.location.href = `mailto:${support}`
  }

  return (
    <Stack
      gap="8"
      direction="col"
      className="my-48 text-center items-center"
      width="144"
    >
      <ModalCenteredHeaderIcon name="forbid" />

      <Stack className="items-center" gap="2" direction="col">
        <Heading fontSize="3xl" className="-my-2">
          <AppTrans
            t={t}
            i18nKey="disabled:title"
            components={{
              br: <br />,
            }}
          />
        </Heading>
        <Stack gap="1" direction="col">
          <Text fontSize="sm" textColor="brand">
            {t('disabled:subtitle')}
          </Text>
          <Text fontSize="sm" textColor="secondary">
            {support}
          </Text>
        </Stack>
      </Stack>
      <Stack gap="4" direction="col">
        <Button
          type="button"
          onClick={handleContactClick}
          width="full"
          className="px-8"
          iconRight="arrow-right"
        >
          {t('disabled:action.contact')}
        </Button>
        <Button
          type="button"
          onClick={handleBackClick}
          variant="text"
          size="sm"
        >
          {t('disabled:action.logout')}
        </Button>
      </Stack>
    </Stack>
  )
}
