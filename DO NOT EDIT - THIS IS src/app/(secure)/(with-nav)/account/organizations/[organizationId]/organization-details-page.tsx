'use client'

import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type {
  FinanceEntityId,
  OnboardingStep,
  OnboardingStepStatus,
  OrganizationId,
  TeamId,
  UserId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { UpdateOrganizationInput } from '@mntn-dev/organization-service/client'
import {
  Button,
  FormField,
  Heading,
  SidebarLayoutContent,
  Stack,
  Surface,
  Text,
  Toggle,
  useToast,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client'
import { BillingProfilesList } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/components/billing-profiles-list.tsx'
import { OrganizationBrandPaymentsAndPrograms } from '~/app/(secure)/(with-nav)/account/organizations/components/organization-brand-payments-and-programs.tsx'
import { useBreadcrumbs } from '~/components/breadcrumbs/index.ts'
import { OnboardingStatusTag } from '~/components/onboarding/onboarding-status-tag.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'
import { usePermissions } from '~/hooks/secure/use-permissions'

import { TeamBlade } from '../[organizationId]/teams/components/team-blade.tsx'
import { UserBlade } from '../[organizationId]/users/components/user-blade.tsx'
import { OrganizationAgencyPrograms } from '../components/organization-agency-programs.tsx'
import { useRefreshOrganizations } from '../hooks/use-refresh-organizations.ts'
import { OnboardingChecklist } from './components/onboarding-checklist.tsx'
import { OrganizationEditForm } from './components/organization-edit-form.tsx'

type OrganizationDetailsPageProps = {
  organizationId: OrganizationId
  financeEntityId: FinanceEntityId
}

export const OrganizationDetailsPage = ({
  organizationId,
  financeEntityId,
}: OrganizationDetailsPageProps) => {
  const { me } = useMe()
  const router = useRouter()
  const { t } = useTranslation([
    'organization-details',
    'toast',
    'organizations',
  ])
  const { showToast } = useToast()
  const refreshOrganization = useRefreshOrganizations()
  const { hasPermission } = usePermissions()

  const [organization] =
    trpcReactClient.organizations.getOrganization.useSuspenseQuery({
      organizationId,
    })

  const { mutateAsync: updateOrganization, isPending: isUpdating } =
    trpcReactClient.organizations.updateOrganization.useMutation()

  const { mutateAsync: patchOrganization, isPending: isPatching } =
    trpcReactClient.organizations.patchOrganization.useMutation()

  const {
    mutateAsync: setOnboardingStep,
    isPending: isUpdatingOnboardingStep,
  } = trpcReactClient.organizations.setOnboardingStep.useMutation()

  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId': organization?.name,
    })
    return () => setBreadcrumbTokens({})
  }, [organization, setBreadcrumbTokens])

  const handleOnboardingStatusChange = async ({
    step,
    status,
  }: {
    step: OnboardingStep
    status: OnboardingStepStatus
  }) => {
    await setOnboardingStep({ organizationId, step, status })
    await refreshOrganization({ organizationId })
  }

  const handleOrganizationUpdate = async (input: UpdateOrganizationInput) => {
    await updateOrganization(input)
    await refreshOrganization({ organizationId })

    showToast.info({
      title: t('toast:organization.updated.title'),
      body: t('toast:organization.updated.body'),
      dataTestId: 'organization-updated-info-toast',
      dataTrackingId: 'organization-updated-info-toast',
    })
  }

  const handleUserClicked = (userId: UserId) => () => {
    router.push(
      me.userId === userId
        ? route('/account/profile')
        : route('/account/organizations/:organizationId/users/:userId').params({
            organizationId,
            userId,
          })
    )
  }

  const handleTeamClicked = (teamId: TeamId) => () => {
    router.push(
      route('/account/organizations/:organizationId/teams/:teamId').params({
        organizationId,
        teamId,
      })
    )
  }

  const handleActiveChanged = async (isBlocked: boolean) => {
    await patchOrganization({ organizationId, isBlocked })
  }

  const isBusy = isUpdating || isPatching || isUpdatingOnboardingStep

  return (
    <SidebarLayoutContent>
      <Stack
        direction="col"
        gap="16"
        width="3/4"
        justifyContent="center"
        className="mx-auto"
      >
        <OrganizationEditForm
          organization={organization}
          isUpdating={isBusy}
          onUpdate={handleOrganizationUpdate}
        />
        {hasPermission('customer-organization:administer') &&
          organization?.organizationType === 'agency' && (
            <>
              <FormField columnSpan={6}>
                <FormField.Label>
                  {t('organization-details:internal.internal-only')}
                </FormField.Label>
                <FormField.Control>
                  <OrganizationAgencyPrograms
                    organizationId={organizationId}
                    financeEntityId={financeEntityId}
                  />
                </FormField.Control>
              </FormField>

              <FormField columnSpan={6}>
                <FormField.Label>
                  {t('organization-details:internal.internal-only')}
                </FormField.Label>
                <FormField.Control>
                  <Surface border padding="4">
                    <Surface.Header className="p-4">
                      <Stack gap="0">
                        <Heading
                          fontSize="xl"
                          fontWeight="bold"
                          textColor="primary"
                        >
                          {t('organization-details:internal.onboarding.title')}
                        </Heading>
                        <div className="grow" />
                        <OnboardingStatusTag
                          onboardingStatus={organization.onboarding.status}
                        />
                      </Stack>
                    </Surface.Header>
                    <Surface.Body>
                      <OnboardingChecklist
                        organization={organization}
                        onOnboardingStatusChange={handleOnboardingStatusChange}
                        isBusy={isBusy}
                      />
                    </Surface.Body>
                  </Surface>
                </FormField.Control>
              </FormField>
            </>
          )}

        {organization.organizationType === 'brand' && (
          <FormField columnSpan={6}>
            <FormField.Control>
              <BillingProfilesList organizationId={organizationId} />
            </FormField.Control>
          </FormField>
        )}

        {hasPermission('customer-organization:administer') &&
          organization?.organizationType === 'brand' && (
            <FormField columnSpan={6}>
              <FormField.Label>
                {t('organization-details:internal.internal-only')}
              </FormField.Label>
              <FormField.Control>
                <OrganizationBrandPaymentsAndPrograms
                  organizationId={organizationId}
                  billingProfile={organization.billingProfiles?.find(
                    (profile) => !!profile.defaultProfile
                  )}
                />
              </FormField.Control>
            </FormField>
          )}

        {hasPermission('customer-organization:administer') && (
          <FormField columnSpan={6}>
            <FormField.Label>
              {t('organization-details:internal.internal-only')}
            </FormField.Label>
            <FormField.Control>
              <Surface border padding="4">
                <Stack direction="row" gap="4" alignItems="center">
                  <Toggle
                    checked={organization.isBlocked}
                    onChange={handleActiveChanged}
                  />
                  <Text>{t('organization-details:action.block')}</Text>
                </Stack>
              </Surface>
            </FormField.Control>
          </FormField>
        )}

        <Surface padding="6" border>
          <Stack direction="col" gap="6">
            <Stack direction="col" gap="2">
              <Stack alignItems="center">
                <Text textColor="secondary" fontWeight="medium">
                  {t(
                    `organization-details:teams.title.${me.organizationType}`,
                    {
                      count: organization.teams?.length,
                    }
                  )}
                </Text>
                <div className="flex-grow" />
                <Button
                  variant="secondary"
                  width="28"
                  iconRight="arrow-right"
                  onClick={() =>
                    router.push(
                      route(
                        '/account/organizations/:organizationId/teams'
                      ).params({ organizationId })
                    )
                  }
                  disabled={isBusy}
                >
                  {t(
                    `organization-details:teams.button.${me.organizationType}`
                  )}
                </Button>
              </Stack>
              <Stack direction="col" gap="2">
                {organization.teams?.map((team) => (
                  <TeamBlade
                    key={team.teamId}
                    team={team}
                    onClick={handleTeamClicked(team.teamId)}
                    disabled={isBusy}
                  />
                ))}
              </Stack>
            </Stack>

            <Stack direction="col" gap="2">
              <Stack alignItems="center">
                <Text textColor="secondary" fontWeight="medium">
                  {t('organization-details:users.title', {
                    count: organization.users?.length,
                  })}
                </Text>
                <div className="flex-grow" />
                <Button
                  variant="secondary"
                  width="28"
                  iconRight="arrow-right"
                  onClick={() =>
                    router.push(
                      route(
                        '/account/organizations/:organizationId/users'
                      ).params({
                        organizationId,
                      })
                    )
                  }
                  disabled={isUpdating}
                >
                  {t('organization-details:users.button')}
                </Button>
              </Stack>
              <Stack direction="col" gap="2">
                {organization.users?.map((user) => (
                  <UserBlade
                    key={user.userId}
                    user={user}
                    onClick={
                      user.isActive ? handleUserClicked(user.userId) : undefined
                    }
                    self={me.userId === user.userId}
                    disabled={isUpdating}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Surface>
      </Stack>
    </SidebarLayoutContent>
  )
}
