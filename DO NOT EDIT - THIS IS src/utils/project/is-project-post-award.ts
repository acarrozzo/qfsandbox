import {
  PostAwardProjectStatusSchema,
  type ProjectDomainQueryModel,
  type ProjectStatus,
} from '@mntn-dev/domain-types'

export const isProjectPostAward = (project: ProjectDomainQueryModel) => {
  return (
    isProjectStatusPostAward(project.status) &&
    project.agencyTeamId !== undefined
  )
}

export const isProjectStatusPostAward = (status: ProjectStatus) => {
  return PostAwardProjectStatusSchema.safeParse(status).success
}
