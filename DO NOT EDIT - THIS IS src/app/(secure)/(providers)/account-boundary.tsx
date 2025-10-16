'use client'

import type { PropsWithChildren } from 'react'

import { usePathname, useRouter } from '@mntn-dev/app-navigation'
import { assertFindRoute, route } from '@mntn-dev/app-routing'
import { useFlags } from '@mntn-dev/flags-client'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  CenteredLayout,
  Heading,
  Icon,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'

import { useMyOrganization } from '~/hooks/secure/use-my-organization.ts'

import { useFailedCharges } from '../(with-nav)/account/organizations/[organizationId]/billing/hooks/use-failed-charges.ts'

export const AccountBoundary = ({ children }: PropsWithChildren) => {
  const { organization } = useMyOrganization()
  const { organizationId } = organization
  const { t } = useTranslation(['account-boundary'])
  const router = useRouter()
  const path = usePathname()
  const currentRoute = assertFindRoute(path)
  const { accountBoundary } = useFlags()

  const failedCharges = useFailedCharges({ organization })

  if (accountBoundary) {
    const handleUpdatePaymentMethodClick = () => {
      router.push(
        route('/account/organizations/:organizationId/billing/methods').params({
          organizationId,
        })
      )
    }

    if (
      failedCharges.length > 0 &&
      !route('/account/organizations/:organizationId/billing').isMatch(
        currentRoute.pattern,
        false
      )
    ) {
      return (
        <CenteredLayout>
          <Surface className="w-full max-w-2xl mx-auto bg-container-tertiary">
            <Surface.Section>
              <Stack gap="3" direction="col" padding="6">
                <Icon
                  size="5xl"
                  name="error-warning"
                  className="m-auto"
                  color="negative"
                />
                <Heading fontSize="4xl" className="-mb-3">
                  {t('account-boundary:update-payment-method.title')}
                </Heading>
              </Stack>
            </Surface.Section>

            <Surface.Section>
              <Stack direction="col" padding="6" gap="16">
                <Text fontSize="base" textColor="secondary">
                  {t('account-boundary:update-payment-method.body')}
                </Text>
                <Button onClick={handleUpdatePaymentMethodClick}>
                  {t('account-boundary:update-payment-method.action.cta')}
                </Button>
              </Stack>
            </Surface.Section>
          </Surface>
        </CenteredLayout>
      )
    }
  }

  return children
}
