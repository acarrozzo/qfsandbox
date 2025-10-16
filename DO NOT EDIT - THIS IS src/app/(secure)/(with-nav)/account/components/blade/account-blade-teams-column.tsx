import type { TeamDomainSelectModel } from '@mntn-dev/domain-types'
import { Blade, Tag } from '@mntn-dev/ui-components'

type AccountBladeTeamsColumnProps = {
  teams: TeamDomainSelectModel[] | undefined
}

export const AccountBladeTeamsColumn = ({
  teams,
}: AccountBladeTeamsColumnProps) => {
  return (
    teams && (
      <Blade.Column
        justifyContent="center"
        alignItems="center"
        direction="row"
        gap="4"
        width="auto"
      >
        {teams.map((team) => (
          <Tag variant="secondary" key={team.teamId}>
            {team.name}
          </Tag>
        ))}
      </Blade.Column>
    )
  )
}
