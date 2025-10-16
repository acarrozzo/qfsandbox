import { useTranslation } from '@mntn-dev/i18n'
import { LinkButton } from '@mntn-dev/ui-components'

type SidebarFieldClearProps = {
  onClear: () => void
}

const SidebarFieldClear = ({ onClear }: SidebarFieldClearProps) => {
  const { t } = useTranslation('generic')
  return (
    <LinkButton
      size="xs"
      textColor="link-subtle"
      onClick={onClear}
      className="no-underline"
    >
      {t('clear')}
    </LinkButton>
  )
}

export { SidebarFieldClear, type SidebarFieldClearProps }
