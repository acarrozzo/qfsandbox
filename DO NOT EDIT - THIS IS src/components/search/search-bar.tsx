'use client'

import { type ChangeEvent, useState } from 'react'

import { useTranslation } from '@mntn-dev/i18n'
import { Icon, Input, type TestIds } from '@mntn-dev/ui-components'

import { useDebouncedCallback } from '~/utils/use-debounced-callback.ts'

type SearchBarProps = Readonly<{
  postpone: boolean
  onChange: (value: string) => void
  defaultValue?: string
}> &
  TestIds

export const SearchBar = ({
  postpone,
  onChange,
  defaultValue,
  dataTestId,
  dataTrackingId,
}: SearchBarProps) => {
  const { t } = useTranslation('generic')

  const [value, setValue] = useState<string | undefined>(defaultValue)

  const handleChange = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
      onChange(event.target.value)
    },
    { postpone }
  )

  return (
    <Input
      defaultValue={value}
      className="h-10"
      iconRight={
        <Icon fill="outline" name="search" size="md" color="tertiary" />
      }
      width="48"
      placeholder={t('search')}
      onChange={handleChange}
      dataTestId={dataTestId}
      dataTrackingId={dataTrackingId}
    />
  )
}
