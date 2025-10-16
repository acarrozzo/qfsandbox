'use client'

import type { PackageServiceDomainSelectModel } from '@mntn-dev/domain-types'
import { Blade, type BladeProps } from '@mntn-dev/ui-components'

type ServiceBladeProps = Readonly<{
  service: PackageServiceDomainSelectModel
  onClick: () => void
}> &
  Omit<BladeProps, 'type' | 'children' | 'isSelectable'>

export const ServiceBlade = ({
  service,
  service: { serviceId, name, description },
  onClick,
  ...props
}: ServiceBladeProps) => (
  <Blade {...props} key={serviceId} type="enhancement" isSelectable>
    <Blade.Right>
      <Blade.EnhancementInfo
        title={name}
        description={description}
        onClick={onClick}
      />
    </Blade.Right>
  </Blade>
)
