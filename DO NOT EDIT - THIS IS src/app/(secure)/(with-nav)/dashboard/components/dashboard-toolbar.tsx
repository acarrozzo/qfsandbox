'use client'

import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { Stack } from '@mntn-dev/ui-components'

import { AllOrganizationSelect } from '~/components/organization/organization-select.tsx'
import { NewProjectButton } from '~/components/projects/new-project-button.tsx'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'

import { ProjectSearch } from './project-search.tsx'
import { DashboardTabs } from './tabs/dashboard-tabs.tsx'

export const DashboardToolbar = () => {
  const router = useRouter()
  const { principal } = usePrincipal()
  const params = useQueryParams<'/dashboard'>()

  const handleOrganizationChanged = (organizationId: OrganizationId | null) => {
    const { search } = params

    router.replace(
      route('/dashboard')
        .query({
          ...(organizationId && { organizationId }),
          ...(search && { search }),
        })
        .toRelativeUrl()
    )
  }

  return (
    <Stack
      className="max-xl:flex-wrap"
      justifyContent="between"
      width="full"
      gap="6"
    >
      <DashboardTabs />
      <Stack
        className="max-xl:w-full"
        alignItems="center"
        justifyContent="between"
        gap="4"
      >
        {principal.authz.organizationType === 'internal' && (
          <AllOrganizationSelect
            deselectable
            onChange={handleOrganizationChanged}
            value={params.organizationId ?? null}
          />
        )}
        <ProjectSearch />
        <NewProjectButton />
      </Stack>
    </Stack>
  )
}
