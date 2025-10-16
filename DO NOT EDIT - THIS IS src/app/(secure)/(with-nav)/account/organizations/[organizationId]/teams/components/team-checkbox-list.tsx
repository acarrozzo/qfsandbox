import { forwardRef, useRef } from 'react'

import type { TeamDomainSelectModel, TeamId } from '@mntn-dev/domain-types'
import { Checkbox, Stack, Surface, Text } from '@mntn-dev/ui-components'

const renderTeamIds = (map: Map<TeamId, boolean>): TeamId[] => {
  return Array.from(map.entries())
    .filter(([_, value]) => value)
    .map(([key]) => key)
}

type TeamCheckboxListProps = {
  disabled?: boolean
  value: TeamId[]
  onChange: (value: TeamId[]) => void
  teams: TeamDomainSelectModel[]
}

export const TeamCheckboxList = forwardRef<
  HTMLDivElement,
  TeamCheckboxListProps
>(({ disabled, teams, value, onChange }, _ref) => {
  const teamIdMap = useRef<Map<TeamId, boolean>>(
    value.reduce((acc, teamId) => acc.set(teamId, true), new Map())
  )

  const handleCheckboxChange = (teamId: TeamId) => (value: boolean) => {
    teamIdMap.current.set(teamId, value)
    onChange(renderTeamIds(teamIdMap.current))
  }

  return (
    <Surface ref={_ref} border gap="4" padding="4">
      {teams?.map((team) => (
        <Stack key={team.teamId} direction="row" gap="4">
          <Checkbox
            disabled={disabled}
            onChange={handleCheckboxChange(team.teamId)}
            value={teamIdMap.current.get(team.teamId) ?? false}
          />
          <Text fontSize="base" fontWeight="medium">
            {team.name}
          </Text>
        </Stack>
      ))}
    </Surface>
  )
})
