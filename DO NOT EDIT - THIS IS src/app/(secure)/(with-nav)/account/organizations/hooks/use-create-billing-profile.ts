import { useCallback } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { useToast } from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

type UseCreateBillingProfileProps = {
  organizationId: OrganizationId
}

export const useCreateBillingProfile = ({
  organizationId,
}: UseCreateBillingProfileProps) => {
  const router = useRouter()
  const { showToast } = useToast()

  const createBillingProfile =
    trpcReactClient.financeCoordinator.createBillingProfile.useMutation()

  const handleCreate = useCallback(
    async (
      _emailAddress: string,
      name: string,
      firstName: string,
      lastName: string
    ) => {
      try {
        const billingProfile = await createBillingProfile.mutateAsync({
          organizationId,
          profileName: name,
          contactEmailAddress: _emailAddress,
          firstName: firstName,
          lastName: lastName,
          defaultProfile: false,
        })

        assertExists(
          billingProfile,
          'Billing profile is required in useCreateBillingProfileEmail'
        )

        showToast.success({
          title: 'Billing Profile Created',
          body: 'Your billing profile has been created successfully.',
          dataTestId: 'billing-profile-created-success-toast',
          dataTrackingId: 'billing-profile-created-success-toast',
        })

        // Redirect back to the organization's billing page
        router.push(
          route(
            '/account/organizations/:organizationId/billing/profiles/:billingProfileId'
          ).params({
            organizationId,
            billingProfileId: billingProfile.billingProfileId,
          })
        )
      } catch {
        showToast.error({
          title: 'Failed to Create Billing Profile',
          body: 'There was an error creating your billing profile. Please try again.',
          dataTestId: 'billing-profile-created-error-toast',
          dataTrackingId: 'billing-profile-created-error-toast',
        })
      }
    },
    [createBillingProfile, organizationId, router, showToast]
  )

  return {
    handleCreate,
    isCreating: createBillingProfile.isPending,
  }
}
