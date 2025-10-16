import type { ServiceStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag, type TagProps } from '@mntn-dev/ui-components'

const statusTagPropsMap: Record<
  ServiceStatus,
  (options: { system?: boolean }) => Pick<TagProps, 'type' | 'icon'>
> = {
  published: ({ system }) => ({
    type: system ? 'notice' : 'success',
    iconLeft: { name: system ? 'lock-close' : 'check' },
  }),
  draft: () => ({ type: 'info' }),
  archived: () => ({ type: 'default' }),
}

export const ServiceStatusTag = ({
  status,
  system,
}: {
  status: ServiceStatus
  system?: boolean
}) => {
  const { t } = useTranslation('service-types')

  return (
    <Tag variant="secondary" {...statusTagPropsMap[status]({ system })}>
      {t(`status.${status}`)}
    </Tag>
  )
}
