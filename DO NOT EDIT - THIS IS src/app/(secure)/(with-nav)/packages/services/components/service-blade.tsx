'use client'

import { useTranslation } from '@mntn-dev/i18n'
import type { ServiceDomainQueryModelWithAcl } from '@mntn-dev/package-service/client'
import { Blade, type BladeProps, List } from '@mntn-dev/ui-components'

import { ServiceStatusTag } from '~/components/tag/index.ts'
import { deriveDeliverablesNames } from '~/lib/deliverables/deliverable-helpers.ts'

import { isSystemService } from '../helpers/service-helper.ts'

type ServiceBladeProps = Readonly<{
  service: ServiceDomainQueryModelWithAcl
  onClick: () => void
}> &
  Omit<BladeProps, 'type' | 'children' | 'isSelectable'>

export const ServiceBlade = ({
  service,
  service: { serviceId, name, description, deliverables, status },
  onClick,
  ...props
}: ServiceBladeProps) => {
  const { t } = useTranslation('deliverable')

  return (
    <Blade {...props} key={serviceId} type="enhancement" isSelectable>
      <Blade.Right>
        <Blade.EnhancementInfo
          title={name}
          description={description}
          content={
            <List>
              {deriveDeliverablesNames({ deliverables, t }).map((item) => (
                <List.Item key={item}>{item}</List.Item>
              ))}
            </List>
          }
          onClick={onClick}
          banner={
            <ServiceStatusTag
              status={status}
              system={isSystemService(service)}
            />
          }
        />
      </Blade.Right>
    </Blade>
  )
}
