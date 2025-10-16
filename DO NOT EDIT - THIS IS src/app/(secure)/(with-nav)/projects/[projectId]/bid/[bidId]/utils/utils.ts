import { hasPermission } from '@mntn-dev/authorization-types'
import type { SelectBidOutput } from '@mntn-dev/bid-service'
import type { ProjectDomainSelectModel } from '@mntn-dev/domain-types'
import type { AuthorizedSession } from '@mntn-dev/session-types'

import { evaluateStatus } from '~/utils/status-helpers.ts'

export const isBidder = (session: AuthorizedSession, bid: SelectBidOutput) => {
  return session.authz.teamIds.includes(bid.agencyTeamId)
}

export const isProjectOwner = (
  session: AuthorizedSession,
  project: ProjectDomainSelectModel
) => {
  return session.authz.teamIds.includes(project.brandTeamId)
}

export const canEditBid = (
  session: AuthorizedSession,
  project: ProjectDomainSelectModel,
  bid: SelectBidOutput
) => {
  const { isBiddingOpen } = evaluateStatus(project.status)
  return isBidder(session, bid) && isBiddingOpen && bid.status === 'draft'
}

export const canViewBid = (
  session: AuthorizedSession,
  project: ProjectDomainSelectModel,
  bid: SelectBidOutput
) => {
  return (
    isProjectOwner(session, project) ||
    isBidder(session, bid) ||
    hasPermission(session.authz, 'project:administer')
  )
}
