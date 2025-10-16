import type { TeamId } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

type UseTeamBillingProfileFormSelectProps = {
  teamId: TeamId
}

export const useTeamBillingProfileFormSelect = ({
  teamId,
}: UseTeamBillingProfileFormSelectProps) => {
  // This query will return immediately from cache, or suspend while fetching;
  // the billing profile will also be included in the team.
  // if the team is mutated, this query will be refetched
  const [team] =
    trpcReactClient.teams.getTeamWithBillingProfile.useSuspenseQuery(
      {
        teamId,
      },
      { refetchOnMount: false }
    )

  // this query will return immediately from cache or fetch
  // there will be no suspense while fetching this query
  // if the billing profile is mutated, this query will be refetched
  const { data: billingProfileData } =
    trpcReactClient.financeCoordinator.findBillingProfile.useQuery(
      {
        billingProfileId: team.billingProfileId,
      },
      { refetchOnMount: false }
    )

  // return the billing profile from the findBillingProfile query or get it from the team
  const billingProfile =
    billingProfileData?.billingProfile ?? team.billingProfile

  return {
    team,
    billingProfile,
  }
}
