import { forwardRef } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { BillingProfileId, OrganizationId } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Blade,
  BladeList,
  Button,
  Heading,
  Icon,
  Stack,
  Surface,
  Text,
  useOpenState,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { BillingProfileCreateModal } from '../../../components/billing-profile-create-modal.tsx'

type BillingProfilesListProps = {
  organizationId: OrganizationId
}

export const BillingProfilesList = forwardRef<
  HTMLDivElement,
  BillingProfilesListProps
>(({ organizationId }, ref) => {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const { multipleBillingProfiles } = useFlags()
  const { t } = useTranslation(['organization-details', 'billing'])
  const { open, onOpen, onClose } = useOpenState()

  const { data: billingProfiles } =
    trpcReactClient.financeCoordinator.listBillingProfiles.useQuery({
      organizationId,
    })

  const handleBillingProfileClick =
    (billingProfileId: BillingProfileId) => () => {
      router.push(
        route(
          '/account/organizations/:organizationId/billing/profiles/:billingProfileId'
        ).params({
          organizationId,
          billingProfileId,
        })
      )
    }

  const show =
    multipleBillingProfiles &&
    (hasPermission('customer-organization:administer') ||
      hasPermission('own-organization:administer'))

  if (!show) {
    return null
  }

  return (
    <>
      <Surface ref={ref} border padding="6">
        <Surface.Header className="p-4">
          <Stack alignItems="center">
            <Heading fontSize="xl" fontWeight="bold" textColor="primary">
              {t('billing:billing-profiles')}
            </Heading>
            <div className="flex-grow" />
            <Button
              variant="secondary"
              width="28"
              iconRight="add"
              onClick={onOpen}
            >
              {t('billing:add-billing-profile')}
            </Button>
          </Stack>
        </Surface.Header>
        <Surface.Body>
          <BladeList>
            {billingProfiles?.map((profile) => (
              <Blade
                type="mini"
                key={profile.billingProfileId}
                onClick={handleBillingProfileClick(profile.billingProfileId)}
                hasHoverState
              >
                <Blade.Column grow>
                  <Text>{profile.name}</Text>
                </Blade.Column>
                <Blade.Column>
                  <Icon name="chevron-right" size="sm" color="secondary" />
                </Blade.Column>
              </Blade>
            ))}
          </BladeList>
        </Surface.Body>
      </Surface>

      <BillingProfileCreateModal
        organizationId={organizationId}
        open={open}
        onClose={onClose}
      />
    </>
  )
})
