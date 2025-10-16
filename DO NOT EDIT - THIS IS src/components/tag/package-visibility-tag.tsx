import type { PackageVisibility } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag } from '@mntn-dev/ui-components'

export const PackageVisibilityTag = ({
  visibility,
}: {
  visibility: PackageVisibility
}) => {
  const { t } = useTranslation('package-types')

  return (
    visibility === 'internal' && (
      <Tag variant="secondary" type="warning">
        {t('internal-only')}
      </Tag>
    )
  )
}
