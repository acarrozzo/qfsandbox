import type { PackageServiceDomainQueryModel } from '@mntn-dev/domain-types'
import { Blade, type BladeProps } from '@mntn-dev/ui-components'

import { ServiceTypeTag } from '#components/tag/index.ts'

import { PackageServicePrice } from './package-service-price.tsx'

type PackageServiceBladeProps = Readonly<{
  packageService: PackageServiceDomainQueryModel
  onClick: () => void
  onDelete: () => void
  isDisabled?: boolean
  hideMenu?: boolean
}> &
  Omit<BladeProps, 'type' | 'children' | 'isSelectable'>

export const PackageServiceBlade = ({
  packageService,
  onClick,
  onDelete,
  isDisabled,
  hideMenu,
  ...props
}: PackageServiceBladeProps) => {
  return (
    <Blade {...props} type="service" onClick={onClick} gap="8">
      <Blade.Column grow shrink minWidth="0" paddingLeft="8">
        <Blade.Title truncate textColor="primary">
          {packageService.name}
        </Blade.Title>
      </Blade.Column>
      <Blade.Column>
        <PackageServicePrice packageService={packageService} />
      </Blade.Column>
      <Blade.Column minWidth="24">
        <ServiceTypeTag serviceType={packageService.serviceType} />
      </Blade.Column>
      {!hideMenu && (
        <Blade.Column>
          <Blade.MediaMenu canDelete={!isDisabled} onDelete={onDelete} />
        </Blade.Column>
      )}
    </Blade>
  )
}
