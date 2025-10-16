import { getPackageBillingMethodsByPartnerPrograms } from '@mntn-dev/billing/utilities'
import {
  isCreditProgramId,
  type OrganizationId,
  type PackageSource,
  type ProjectDomainQueryModel,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { logger } from '@mntn-dev/logger'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { isProjectAwarded } from '~/utils/project/is-project-awarded.ts'

export const useValidateProjectTransferrable = () => {
  const utils = trpcReactClient.useUtils()
  const { t } = useTranslation(['project-transfer'])

  const validateInvoiceBillingProfile = async (
    organizationId: OrganizationId
  ) => {
    const organization =
      await utils.client.organizations.getOrganizationWithBillingInfo.query({
        organizationId,
      })

    const billingProfileId = organization.billingProfiles?.[0]?.billingProfileId

    if (billingProfileId === undefined) {
      return t('project-transfer:error.no-billing-profile')
    }

    // get invoicing information
    const billingAddress =
      await utils.client.financeCoordinator.getBillingProfileAddress.query({
        billingProfileId,
      })
    const billingContacts =
      await utils.client.financeCoordinator.listBillingProfileContacts.query({
        billingProfileId,
      })

    if (billingAddress === undefined || billingContacts.length === 0) {
      return t('project-transfer:error.missing-invoice-information')
    }

    return undefined
  }

  const validatePackageTransferrable = async (
    packageSource: PackageSource,
    organizationId: OrganizationId
  ) => {
    try {
      if (isCreditProgramId(packageSource)) {
        const organization =
          await utils.client.organizations.getOrganizationWithBillingInfo.query(
            {
              organizationId,
            }
          )

        const isTransferrableToOrg =
          getPackageBillingMethodsByPartnerPrograms(packageSource, organization)
            .length > 0

        return isTransferrableToOrg
          ? undefined
          : t('project-transfer:error.partner-program-mismatch')
      }

      return undefined
    } catch (error) {
      logger.error('Error validating project transferrable', { error })
      return t('project-transfer:error.unknown')
    }
  }

  const validateProjectTransferrable = async (
    project: ProjectDomainQueryModel,
    organizationId: OrganizationId
  ) => {
    if (isProjectAwarded(project)) {
      const invoiceBillingProfileError =
        await validateInvoiceBillingProfile(organizationId)

      if (invoiceBillingProfileError) {
        return invoiceBillingProfileError
      }
    }

    const packageSource = project.package?.packageSource

    if (packageSource) {
      const packageTransferrableError = await validatePackageTransferrable(
        packageSource,
        organizationId
      )

      return packageTransferrableError
    }

    return undefined
  }

  return validateProjectTransferrable
}
