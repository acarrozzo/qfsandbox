'use client'

import { type ChangeEvent, useMemo, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import type { CreateOrganizationInput } from '@mntn-dev/organization-service/client'
import {
  Button,
  Icon,
  Input,
  PageHeader,
  SidebarLayoutContent,
  Stack,
  Tabs,
  useOpenState,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { SingleColumn } from '~/components/layout/single-column/single-column.tsx'
import { useDebouncedCallback } from '~/utils/use-debounced-callback.ts'

import { OrganizationBladeList } from './components/organization-blade-list.tsx'
import { OrganizationCreateModal } from './components/organization-create-modal.tsx'
import { useRefreshOrganizations } from './hooks/use-refresh-organizations.ts'

type OrganizationListTab = 'all' | 'blocked' | 'brand' | 'agency'

export const OrganizationListPage = () => {
  const router = useRouter()
  const { t } = useTranslation(['generic', 'organization-list', 'toast'])
  const refreshOrganizations = useRefreshOrganizations()
  const [search, setSearch] = useState('')
  const [currentTab, setCurrentTab] = useState<OrganizationListTab>('all')

  const [organizations] =
    trpcReactClient.organizations.listOrganizations.useSuspenseQuery({
      isBlocked: currentTab === 'blocked',
      organizationType:
        currentTab === 'brand' || currentTab === 'agency'
          ? currentTab
          : undefined,
    })

  const { mutateAsync: createOrganization, isPending: isOrganizationCreating } =
    trpcReactClient.organizations.createOrganization.useMutation()

  const handleOrganizationCreate = async (input: CreateOrganizationInput) => {
    const { organizationId } = await createOrganization(input)
    await refreshOrganizations({ organizationId })

    router.push(
      route('/account/organizations/:organizationId').params({
        organizationId,
      })
    )
  }

  const organizationCreateOpenState = useOpenState()

  const filteredOrganizations = useMemo(() => {
    if (search === '') {
      return organizations
    }

    return organizations.filter((organization) =>
      organization.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [organizations, search])

  const handleChange = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    }
  )

  const handleTabChange = (id: OrganizationListTab) => {
    setCurrentTab(id)
  }

  return (
    <SidebarLayoutContent>
      <PageHeader
        dataTestId="organization-list-page-header"
        dataTrackingId="organization-list-page-header"
      >
        <PageHeader.Main>
          <PageHeader.Title title={t('organization-list:title')} />
        </PageHeader.Main>
      </PageHeader>
      <SingleColumn>
        <Stack
          alignItems="center"
          justifyContent="between"
          wrap="wrap"
          className="p-2"
        >
          <Tabs<OrganizationListTab>
            current={currentTab}
            onClick={handleTabChange}
          >
            <Tabs.Tab id="all" name={t('organization-list:tabs.all')} />
            <Tabs.Tab id="brand" name={t('organization-list:tabs.brand')} />
            <Tabs.Tab id="agency" name={t('organization-list:tabs.maker')} />
            <Tabs.Divider />
            <Tabs.Tab id="blocked" name={t('organization-list:tabs.blocked')} />
          </Tabs>
          <Stack gap="6">
            <Input
              placeholder={t('generic:search')}
              iconRight={<Icon size="lg" color="tertiary" name="search" />}
              className="w-64"
              defaultValue={search}
              onChange={handleChange}
            />
            <Button
              onClick={organizationCreateOpenState.onToggle}
              iconRight="add"
              variant="secondary"
            >
              {t('organization-list:actions.create')}
            </Button>
          </Stack>
        </Stack>
        <OrganizationBladeList organizations={filteredOrganizations} />
      </SingleColumn>
      {organizationCreateOpenState.open && (
        <OrganizationCreateModal
          {...organizationCreateOpenState}
          onCreate={handleOrganizationCreate}
          isCreating={isOrganizationCreating}
        />
      )}
    </SidebarLayoutContent>
  )
}
