'use client'

import { type ChangeEvent, type KeyboardEvent, useState } from 'react'

import {
  type AddFunction,
  Button,
  getChildTestIds,
  Input,
  type InputProps,
  Multivalue,
  Stack,
  type TestIds,
} from '@mntn-dev/ui-components'

type StringMultivalueProps = Pick<
  InputProps,
  | 'iconLeft'
  | 'iconRight'
  | 'placeholder'
  | 'hasError'
  | 'hasSuccess'
  | 'hasWarning'
> &
  TestIds & {
    onChange: (values: string[]) => void
    initialValues?: string[]
  }

const StringMultivalue = ({
  dataTestId,
  dataTrackingId,
  initialValues,
  onChange,
}: StringMultivalueProps) => {
  const [values, setValues] = useState<string[]>(initialValues || [])
  const [current, setCurrent] = useState<string>('')

  const handleChange = (newValues: string[]) => {
    setValues(newValues)
    onChange(newValues)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrent(e.target.value)
  }

  const handleKeyDown =
    (onAdd: AddFunction<string>) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleClick(onAdd)()
      }
    }

  const handleClick = (onAdd: AddFunction<string>) => () => {
    onAdd(current)
    setCurrent('')
  }

  return (
    <Multivalue<string>
      values={values}
      onChange={handleChange}
      dataTestId={dataTestId}
      dataTrackingId={dataTrackingId}
    >
      {({ onAdd }) => (
        <Stack gap="2" width="96">
          <Input
            value={current}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown(onAdd)}
            {...getChildTestIds({ dataTestId, dataTrackingId }, 'input')}
          />
          <Button
            type="button"
            onClick={handleClick(onAdd)}
            variant="secondary"
            {...getChildTestIds({ dataTestId, dataTrackingId }, 'add')}
          >
            Add
          </Button>
        </Stack>
      )}
    </Multivalue>
  )
}

export { StringMultivalue }
