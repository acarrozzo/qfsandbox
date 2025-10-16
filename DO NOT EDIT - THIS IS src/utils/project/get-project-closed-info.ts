import {
  type ActivityDomainQueryModel,
  isActivityType,
} from '@mntn-dev/domain-types'

export const getProjectClosedInfo = (
  projectClosedActivity?: ActivityDomainQueryModel
) => {
  if (
    !projectClosedActivity ||
    !isActivityType(projectClosedActivity, 'project_closed')
  ) {
    return null
  }

  return {
    reason: projectClosedActivity.details?.data.reason,
    name: (projectClosedActivity as ActivityDomainQueryModel).actor
      ?.displayName,
    timestamp: projectClosedActivity.timestamp,
  }
}
