'use client'

import { forwardRef, type KeyboardEvent, useRef, useState } from 'react'

import { USPhoneNumberSchema } from '@mntn-dev/domain-types'
import {
  type AddFunction,
  Button,
  FormField,
  getChildTestIds,
  getPhoneObjectFromParsed,
  getPhoneObjectsFromArray,
  type InputProps,
  Multivalue,
  type MultivalueObjectValue,
  type ParsedPhoneNumber,
  PhoneInput,
  type PhoneInputRef,
  Stack,
  type TestIds,
} from '@mntn-dev/ui-components'
import { mergeRefs } from '@mntn-dev/utilities'

type PhoneMultivalueProps = Pick<
  InputProps,
  'hasError' | 'hasSuccess' | 'hasWarning' | 'onBlur'
> &
  TestIds & {
    onChange: (phoneNumbers: string[]) => void
    initialPhoneNumbers?: string[]
  }

const PhoneMultivalue = forwardRef<PhoneInputRef, PhoneMultivalueProps>(
  (
    { dataTestId, dataTrackingId, onBlur, onChange, initialPhoneNumbers },
    ref
  ) => {
    const [phoneNumbers, setPhoneNumbers] = useState<MultivalueObjectValue[]>(
      initialPhoneNumbers ? getPhoneObjectsFromArray(initialPhoneNumbers) : []
    )
    const [current, setCurrent] = useState<ParsedPhoneNumber | null>(null)
    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const innerRef = useRef<PhoneInputRef>(null)
    const inputRef = mergeRefs(innerRef, ref)

    const handleChange = (phones: MultivalueObjectValue[]) => {
      setPhoneNumbers(phones)

      onChange(phones.map((phone) => phone.value))
    }

    const handleInputChange = (parsedPhoneNumber: ParsedPhoneNumber) => {
      setCurrent(parsedPhoneNumber)
      setHasError(false)
      setErrorMessage('')
    }

    const handleClick = (onAdd: AddFunction<MultivalueObjectValue>) => () => {
      if (current === null) {
        return
      }

      const { success, error } = USPhoneNumberSchema.safeParse(
        current?.number?.e164
      )

      if (success) {
        onAdd(getPhoneObjectFromParsed(current))
        innerRef.current?.resetValue()
      } else {
        setHasError(true)
        setErrorMessage(error.issues[0]?.message ?? 'Invalid phone number')
      }

      innerRef.current?.focus()
    }

    const handleKeyDown =
      (onAdd: AddFunction<MultivalueObjectValue>) =>
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleClick(onAdd)()

          e.preventDefault()
          e.stopPropagation()
        }
      }

    return (
      <Multivalue<MultivalueObjectValue>
        values={phoneNumbers}
        onChange={handleChange}
        dataTestId={dataTestId}
        dataTrackingId={dataTrackingId}
      >
        {({ onAdd }) => (
          <Stack gap="2" width="96">
            <FormField hasError={hasError}>
              <PhoneInput
                onBlur={onBlur}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown(onAdd)}
                ref={inputRef}
                {...getChildTestIds({ dataTestId, dataTrackingId }, 'input')}
              />
              <FormField.Error>{errorMessage}</FormField.Error>
            </FormField>
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
)

export { PhoneMultivalue }
