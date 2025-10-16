import type { OrganizationDomainSelectModel } from '@mntn-dev/domain-types'

import { usePrincipal } from './use-principal.ts'

type UseDynamicOrganizationTypeProps = {
  organization?: OrganizationDomainSelectModel
}

/**
 * This hook is used to get an organization type.
 * If the user is not an internal user or no organization id is supplied, it will return the organization type for the principal.
 * If the user is an internal user and an organization id is supplied, it will return the organization type for the supplied organization id.
 */
export const useDynamicOrganizationType = ({
  organization,
}: UseDynamicOrganizationTypeProps) => {
  const { principal } = usePrincipal()

  const { organizationId, organizationType: dynamicOrganizationType } =
    principal.authz.organizationType !== 'internal' || !organization
      ? principal.authz
      : organization

  return {
    organizationId,
    dynamicOrganizationType,
    myOrganizationType: principal.authz.organizationType,
  }
}
