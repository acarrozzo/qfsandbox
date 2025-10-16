'use client'

import { type PropsWithChildren, useEffect } from 'react'

import { useFlags } from '@mntn-dev/flags-client'
import { Trans, useTranslation } from '@mntn-dev/i18n'
import {
  CenteredLayout,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
} from '@mntn-dev/ui-components'
import { usePrevious } from '@mntn-dev/ui-utilities'

export function Maintenance({ children }: PropsWithChildren) {
  const { maintenanceMode } = useFlags()
  const { t } = useTranslation(['maintenance'])
  const previousMaintenanceMode = usePrevious(maintenanceMode)

  useEffect(() => {
    if (previousMaintenanceMode && maintenanceMode === false) {
      window.location.reload()
    }
  }, [previousMaintenanceMode, maintenanceMode])

  return maintenanceMode ? (
    <CenteredLayout>
      <Stack gap="4" direction="col" className="my-48 text-center">
        <Stack gap="3" direction="col">
          <Icon
            size="12xl"
            name="MaintenanceIcon"
            className="m-auto"
            color="brand"
          />
          <Heading fontSize="5xl" className="-mb-3">
            {t('maintenance:title')}
          </Heading>
          <Heading fontSize="3xl" textColor="brand">
            {t('maintenance:sub-title')}
          </Heading>
        </Stack>
        <Stack className="mt-6 items-center" gap="2" direction="col">
          <Text fontSize="lg" textColor="secondary" fontWeight="bold">
            {t('maintenance:content1')}
          </Text>
          <Text fontSize="lg" textColor="tertiary">
            <Trans
              t={t}
              i18nKey="maintenance:content2"
              values={{ email: 'info@quickframe.com' }}
              components={{
                a: <Link href="mailto:info@quickframe.com" />,
              }}
            />
          </Text>
        </Stack>
      </Stack>
    </CenteredLayout>
  ) : (
    children
  )
}
