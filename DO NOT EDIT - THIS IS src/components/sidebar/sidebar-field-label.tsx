import { FormField } from '@mntn-dev/ui-components'

import {
  SidebarFieldClear,
  type SidebarFieldClearProps,
} from './sidebar-field-clear.tsx'

type SidebarFieldLabelProps = Partial<
  Pick<SidebarFieldClearProps, 'onClear'>
> & {
  label: string
}

const SidebarFieldLabel = ({ label, onClear }: SidebarFieldLabelProps) => {
  const labelComponent = () => (
    <FormField.Label fontSize="base" fontWeight="bold" textColor="primary">
      {label}
    </FormField.Label>
  )

  return onClear ? (
    <FormField.Overline>
      {labelComponent()}
      <SidebarFieldClear onClear={onClear} />
    </FormField.Overline>
  ) : (
    labelComponent()
  )
}

export { SidebarFieldLabel }
