import type { ProjectDomainQueryModel } from '@mntn-dev/domain-types'
import {
  Button,
  FooterContent,
  FooterContentGroup,
  Heading,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'

type Props = {
  project: ProjectDomainQueryModel
  onSubmitChange?: () => void
}

export const MakerProjectAwardedFooter = ({
  project,
  onSubmitChange,
}: Props) => {
  const { projectId, bids } = project
  const { principal } = usePrincipal()

  const awardedBid = bids?.find((b) => b.status === 'accepted')

  const setProjectPreProduction =
    trpcReactClient.projects.setProjectPreProduction.useMutation()

  if (
    !(awardedBid && principal.authz.teamIds.includes(awardedBid.agencyTeamId))
  ) {
    return null
  }

  const handleSetProjectPreProduction = async () => {
    await setProjectPreProduction.mutateAsync({ projectId })
    onSubmitChange?.()
  }

  return (
    <FooterContent justifyContent="end">
      <FooterContentGroup>
        <Heading fontSize="3xl">Project Ready to Start!</Heading>
      </FooterContentGroup>
      <FooterContentGroup>
        <Button
          size="lg"
          variant="primary"
          loading={setProjectPreProduction.isPending}
          onClick={handleSetProjectPreProduction}
          className="w-[320px]"
          iconRight="arrow-right"
        >
          Let's Go
        </Button>
      </FooterContentGroup>
    </FooterContent>
  )
}
