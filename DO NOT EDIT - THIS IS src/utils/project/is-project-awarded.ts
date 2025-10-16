import {
  AwardedProjectStatusSchema,
  type ProjectDomainQueryModel,
} from '@mntn-dev/domain-types'

export const isProjectAwarded = (project: ProjectDomainQueryModel) => {
  return (
    AwardedProjectStatusSchema.safeParse(project.status).success &&
    project.agencyTeamId !== undefined
  )
}
