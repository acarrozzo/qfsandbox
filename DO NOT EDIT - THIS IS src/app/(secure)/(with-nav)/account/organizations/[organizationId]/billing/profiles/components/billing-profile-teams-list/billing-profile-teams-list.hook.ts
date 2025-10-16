import { useCallback, useMemo, useState } from 'react'

import type { AppTrans } from '@mntn-dev/app-common'
import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type {
  BillingProfileId,
  OrganizationId,
  TeamId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export type BillingProfileTeamsListProps = {
  organizationId: OrganizationId
  billingProfileId: BillingProfileId
}

export const useBillingProfileTeamsList = ({
  billingProfileId,
  organizationId,
}: BillingProfileTeamsListProps) => {
  const { t } = useTranslation(['billing-profile'])

  const [isBusy, setIsBusy] = useState(false)

  // These will return immediately from cache, or suspend while fetching
  const [billingProfile] =
    trpcReactClient.financeCoordinator.getBillingProfile.useSuspenseQuery({
      billingProfileId,
    })

  const title: Pick<
    React.ComponentProps<typeof AppTrans>,
    't' | 'i18nKey' | 'values'
  > = {
    t: t,
    i18nKey: 'billing-profile:teams.title',
    values: {
      billingProfileName: billingProfile.name,
    },
  }

  const buttonText = t('billing-profile:teams.button')

  const router = useRouter()
  const [teamsData, { refetch: refetchTeams }] =
    trpcReactClient.financeCoordinator.getBillingProfileTeams.useSuspenseQuery({
      billingProfileId,
    })

  const teams = teamsData?.teams ?? []

  const teamsRoute = useMemo(
    () =>
      route('/account/organizations/:organizationId/teams').params({
        organizationId,
      }),
    [organizationId]
  )

  const handleClickToTeams = useCallback(() => {
    setIsBusy(true)
    setTimeout(() => {
      router.push(teamsRoute)
    }, 0)
  }, [teamsRoute, router])

  const handleTeamClicked = useCallback(
    (teamId: TeamId) => () => {
      setIsBusy(true)
      const teamRoute = route(
        '/account/organizations/:organizationId/teams/:teamId'
      ).params({
        organizationId,
        teamId,
      })
      setTimeout(() => {
        router.push(teamRoute)
      }, 0)
    },
    [organizationId, router]
  )

  return {
    buttonText,
    isBusy,
    refetchTeams,
    teams,
    title,

    handleClickToTeams,
    handleTeamClicked,
  }
}
