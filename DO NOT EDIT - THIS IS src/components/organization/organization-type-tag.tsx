import type { OrganizationType } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag, type TagProps, type TagType } from '@mntn-dev/ui-components'

type OrganizationTypeTagProps = Omit<TagProps, 'children' | 'type'> & {
  organizationType: OrganizationType
}

const organizationTypeTagTypeMap: Record<OrganizationType, TagType> = {
  internal: 'success',
  brand: 'info',
  agency: 'warning',
}

export const OrganizationTypeTag = ({
  organizationType,
  ...props
}: OrganizationTypeTagProps) => {
  const { t } = useTranslation('organizations')

  return (
    <Tag type={organizationTypeTagTypeMap[organizationType]} {...props}>
      {t(`tag.${organizationType}`)}
    </Tag>
  )
}
