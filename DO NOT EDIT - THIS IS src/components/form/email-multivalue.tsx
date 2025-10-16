'use client'

import {
  type ChangeEvent,
  type FocusEventHandler,
  forwardRef,
  type KeyboardEvent,
  useMemo,
  useRef,
  useState,
} from 'react'

import { EmailAddressSchema } from '@mntn-dev/domain-types'
import { createErrorMap, defaultRuleFactory } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  type AddFunction,
  Button,
  FormField,
  getChildTestIds,
  Icon,
  Input,
  type InputProps,
  Multivalue,
  Stack,
  type TestIds,
} from '@mntn-dev/ui-components'
import { mergeRefs } from '@mntn-dev/utilities'

type EmailMultivalueProps = Pick<
  InputProps,
  'hasError' | 'hasSuccess' | 'hasWarning'
> &
  TestIds & {
    onBlur?: FocusEventHandler<HTMLInputElement>
    onChange: (emails: string[]) => void
    initialEmails?: string[]
  }

const EmailMultivalue = forwardRef<HTMLInputElement, EmailMultivalueProps>(
  ({ dataTestId, dataTrackingId, onBlur, onChange, initialEmails }, ref) => {
    const [emails, setEmails] = useState<string[]>(initialEmails ?? [])
    const [current, setCurrent] = useState<string>('')
    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { t: tValidation } = useTranslation('validation')

    const defaultErrorMap = useMemo(
      () => createErrorMap(tValidation, defaultRuleFactory),
      [tValidation]
    )

    const innerRef = useRef<HTMLInputElement>(null)
    const inputRef = mergeRefs(innerRef, ref)

    const handleChange = (newEmails: string[]) => {
      setEmails(newEmails)
      onChange(newEmails)
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setCurrent(e.target.value)
      setHasError(false)
      setErrorMessage('')
    }

    const handleClick = (onAdd: AddFunction<string>) => () => {
      if (current === null) {
        return
      }

      const { success, error } = EmailAddressSchema.safeParse(current, {
        errorMap: defaultErrorMap,
      })

      if (success) {
        onAdd(current)
        setCurrent('')
      } else {
        setHasError(true)
        setErrorMessage(error.issues[0]?.message ?? 'Invalid email')
      }

      innerRef.current?.focus()
    }

    const handleKeyDown =
      (onAdd: AddFunction<string>) => (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleClick(onAdd)()

          e.preventDefault()
          e.stopPropagation()
        }
      }

    return (
      <Multivalue<string>
        values={emails}
        onChange={handleChange}
        dataTestId={dataTestId}
        dataTrackingId={dataTrackingId}
      >
        {({ onAdd }) => (
          <Stack gap="2" width="96">
            <FormField hasError={hasError}>
              <Input
                iconLeft={
                  <Icon name="mail" fill="outline" color="brand" size="md" />
                }
                onBlur={onBlur}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown(onAdd)}
                placeholder="name@example.com"
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

export { EmailMultivalue }
