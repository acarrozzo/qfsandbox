'use client'

import { useRef } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type {
  OrganizationDomainQueryModel,
  OrganizationId,
} from '@mntn-dev/domain-types'
import { useWindowVirtualizer } from '@mntn-dev/ui-components'
import { cn } from '@mntn-dev/ui-utilities'

import { OrganizationBlade } from './organization-blade.tsx'

export type OrganizationBladeListProps = {
  organizations: OrganizationDomainQueryModel[]
}

export const OrganizationBladeList = ({
  organizations,
}: OrganizationBladeListProps) => {
  const router = useRouter()
  const parentRef = useRef<HTMLDivElement>(null)
  const [virtualizer, VirtualizationProvider] = useWindowVirtualizer({
    count: organizations.length,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
    estimateSize: () => 212,
    enabled: true,
  })

  const handleOrganizationClicked = (organizationId: OrganizationId) => () => {
    router.push(
      route('/account/organizations/:organizationId').params({
        organizationId,
      })
    )
  }

  const items = virtualizer.getVirtualItems()

  return (
    <VirtualizationProvider value={virtualizer}>
      <div className="w-full h-full">
        <div ref={parentRef} className="w-full h-full">
          <div
            className="w-full relative"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            <div
              className="w-full absolute top-0 left-0"
              style={{
                transform: `translateY(${(items[0]?.start ?? 0) - virtualizer.options.scrollMargin}px)`,
              }}
            >
              {items.map((item) => {
                const organization = organizations[item.index]

                if (!organization) {
                  return null
                }

                const isLast = item.index === items.length - 1

                return (
                  <div
                    key={item.key}
                    data-index={item.index}
                    ref={virtualizer.measureElement}
                    className="w-full"
                  >
                    <OrganizationBlade
                      key={item.key}
                      className={cn('w-full mb-2', isLast && 'mb-0')}
                      organization={organization}
                      onClick={handleOrganizationClicked(
                        organization.organizationId
                      )}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </VirtualizationProvider>
  )
}
