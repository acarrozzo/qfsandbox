'use client'

import { forwardRef, useMemo } from 'react'

import {
  type UserRoleKey,
  UserRoleKeySchema,
  UserRoleKeys,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  FormField,
  type FormFieldProps,
  getChildTestIds,
  type MultiselectOptionItem,
  MultiselectPopout,
  type MultiselectPopoutProps,
  type TestIds,
} from '@mntn-dev/ui-components'

export type UserRoleFormFieldProps = Omit<FormFieldProps, 'children'> &
  Partial<Pick<MultiselectPopoutProps, 'listLocation' | 'placeholder'>> & {
    disabled?: boolean
    label?: string
    errorMessage?: string
    selectedItems?: MultiselectOptionItem[]
    onChange: (items: UserRoleKey[]) => void
    onClose?: () => void
  } & TestIds

export const UserRoleFormField = forwardRef<
  HTMLDivElement,
  UserRoleFormFieldProps
>(
  (
    {
      dataTestId,
      dataTrackingId,
      disabled,
      errorMessage,
      label,
      listLocation = 'above',
      placeholder,
      selectedItems,
      onChange,
      onClose,
      ...props
    }: UserRoleFormFieldProps,
    ref
  ) => {
    const { t } = useTranslation('role')

    const options = useMemo(
      () =>
        UserRoleKeys.map((key) => ({
          name: t(`${key}`),
          id: key,
        })) ?? [],
      [t]
    )

    const handleChange = (items: MultiselectOptionItem[]) => {
      onChange(items.map((item) => UserRoleKeySchema.parse(item.id)))
    }

    return (
      <FormField {...props}>
        {label && <FormField.Label>{label}</FormField.Label>}
        <FormField.Control>
          <MultiselectPopout
            ref={ref}
            options={options}
            onChange={handleChange}
            onClose={onClose}
            placeholder={placeholder ?? t('placeholder')}
            selectedItems={selectedItems}
            {...getChildTestIds(
              { dataTestId, dataTrackingId },
              'user-role-form-field'
            )}
            listLocation={listLocation}
            disabled={disabled}
          />
        </FormField.Control>
        <FormField.Error>{errorMessage ?? t('errors.unknown')}</FormField.Error>
      </FormField>
    )
  }
)
