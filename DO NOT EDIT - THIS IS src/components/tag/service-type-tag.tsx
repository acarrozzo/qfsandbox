import type { ServiceType } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag, type TagType } from '@mntn-dev/ui-components'

const serviceTypeColorMap: Record<ServiceType, TagType> = {
  custom: 'notice',
  included: 'default',
  standard: 'info',
}

export const ServiceTypeTag = ({
  serviceType,
}: {
  serviceType: ServiceType
}) => {
  const { t } = useTranslation('service-types')

  return (
    <Tag type={serviceTypeColorMap[serviceType]}>
      {t(`serviceType.${serviceType}`)}
    </Tag>
  )
}
