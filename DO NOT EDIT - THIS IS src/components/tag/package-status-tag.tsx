import type { PackageStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag, type TagProps } from '@mntn-dev/ui-components'

const statusTagPropsMap: Record<
  PackageStatus,
  Pick<TagProps, 'type' | 'icon'>
> = {
  published: { type: 'success', icon: { name: 'check' } },
  draft: { type: 'info' },
  archived: { type: 'default' },
}

export const PackageStatusTag = ({ status }: { status: PackageStatus }) => {
  const { t } = useTranslation('package-types')

  return (
    <Tag variant="secondary" {...statusTagPropsMap[status]}>
      {t(`status.${status}`)}
    </Tag>
  )
}
