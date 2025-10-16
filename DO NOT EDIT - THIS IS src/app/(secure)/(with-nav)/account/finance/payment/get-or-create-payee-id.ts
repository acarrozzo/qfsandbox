import {
  OrganizationDomainQueryModelSchema,
  OrganizationPayeeId,
} from '@mntn-dev/domain-types'
import { OrganizationService } from '@mntn-dev/organization-service'
import type { AuthorizedSession } from '@mntn-dev/session-types'
import { UserService } from '@mntn-dev/user-service'
import { assertOk } from '@mntn-dev/utilities'

export const getOrCreatePayeeId = async (session: AuthorizedSession) => {
  const me = assertOk(await UserService(session).getMe())

  if (me.organization?.payeeId) {
    return me.organization.payeeId
  }

  const organization = assertOk(
    await OrganizationService(session).updatePayeeInfo({
      organizationId: me.organizationId,
      payeeId: OrganizationPayeeId(),
    })
  )

  const { payeeId } = OrganizationDomainQueryModelSchema.required({
    payeeId: true,
  }).parse(organization)

  return payeeId
}
