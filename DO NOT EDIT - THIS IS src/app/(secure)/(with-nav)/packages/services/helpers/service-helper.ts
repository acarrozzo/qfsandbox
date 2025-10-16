import type { ServiceLike } from '@mntn-dev/domain-types'
import type { ServiceDomainQueryModelWithAcl } from '@mntn-dev/package-service/client'

export const isServiceReadonly = ({
  acl: { canUpdateService, canPatchService },
  ...service
}: ServiceDomainQueryModelWithAcl) =>
  isSystemService(service) || !(canUpdateService || canPatchService)

export const isSystemService = (service: ServiceLike | undefined) =>
  service?.serviceKey !== undefined
