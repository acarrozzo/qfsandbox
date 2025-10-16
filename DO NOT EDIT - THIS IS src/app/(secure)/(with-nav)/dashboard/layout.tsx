import type { PropsWithChildren } from 'react'

import { SidebarLayoutContent } from '@mntn-dev/ui-components'

import { PageHeader } from '~/components/layout/headers/page-header.tsx'
import { SingleColumn } from '~/components/layout/single-column/single-column.tsx'
import { getServerTranslation } from '~/utils/server/get-server-translation.ts'

const dataTestId = 'project-dashboard-page-header'
const dataTrackingId = 'project-dashboard-page-header'

export default async function Layout({ children }: PropsWithChildren) {
  const { t } = await getServerTranslation('dashboard')

  return (
    <SidebarLayoutContent>
      <PageHeader
        title={t('title')}
        dataTestId={dataTestId}
        dataTrackingId={dataTrackingId}
      />
      <SingleColumn>{children}</SingleColumn>
    </SidebarLayoutContent>
  )
}
