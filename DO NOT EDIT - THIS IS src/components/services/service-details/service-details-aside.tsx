'use client'

import { Surface } from '@mntn-dev/ui-components'

import { AsideTabFiles } from './aside-tabs/aside-tab-files.tsx'
import { ServiceDetailsAsideHeader } from './service-details-aside-header.tsx'

const ServiceDetailsAside = () => {
  return (
    <Surface className="p-0 gap-0 w-full h-full overflow-hidden">
      <Surface.Header className="flex flex-col px-8 pt-4">
        <ServiceDetailsAsideHeader />
      </Surface.Header>
      <Surface.Body className="size-full overflow-auto break-all">
        <AsideTabFiles />
      </Surface.Body>
    </Surface>
  )
}

export { ServiceDetailsAside }
