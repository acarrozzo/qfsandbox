'use client'

import {
  type ChangeEvent,
  forwardRef,
  type KeyboardEvent,
  useRef,
  useState,
} from 'react'

import { UrlSchema } from '@mntn-dev/domain-types'
import {
  type AddFunction,
  Button,
  FormField,
  getChildTestIds,
  Icon,
  Input,
  type InputProps,
  Multivalue,
  type MultivalueObjectValue,
  Stack,
  type TestIds,
} from '@mntn-dev/ui-components'
import {
  friendlyUrl,
  mergeRefs,
  safeNormalizeUrl,
  sanitizeUrl,
} from '@mntn-dev/utilities'

type UrlMultivalueProps = Pick<InputProps, 'onBlur'> &
  TestIds & {
    onChange: (urls: string[]) => void
    initialUrls?: string[]
  }

const getUrlObjectsFromStrings = (urls: string[]): MultivalueObjectValue[] =>
  urls.map((url) => getUrlObjectFromString(url))

const getUrlObjectFromString = (url: URL | string): MultivalueObjectValue => {
  return {
    label: friendlyUrl(url),
    value: sanitizeUrl(url),
  }
}

const UrlMultivalue = forwardRef<HTMLInputElement, UrlMultivalueProps>(
  ({ dataTestId, dataTrackingId, onBlur, onChange, initialUrls }, ref) => {
    const [urls, setUrls] = useState<MultivalueObjectValue[]>(
      initialUrls ? getUrlObjectsFromStrings(initialUrls) : []
    )

    const innerRef = useRef<HTMLInputElement | null>(null)
    const inputRef = mergeRefs(innerRef, ref)

    const [current, setCurrent] = useState<string>('')

    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (urls: MultivalueObjectValue[]) => {
      setUrls(urls)
      onChange(urls.map((url) => url.value))
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setCurrent(e.target.value)
      setHasError(false)
      setErrorMessage('')
    }

    const handleClick = (onAdd: AddFunction<MultivalueObjectValue>) => () => {
      if (current) {
        const result = safeNormalizeUrl(current)

        if (!result.success) {
          setHasError(true)
          setErrorMessage('Invalid URL')

          innerRef.current?.focus()
          return
        }

        const url = sanitizeUrl(result.url)
        const { success, error } = UrlSchema.safeParse(url)

        if (success) {
          onAdd(getUrlObjectFromString(url))
          setCurrent('')
        } else {
          setHasError(true)
          setErrorMessage(error.issues[0]?.message ?? 'Invalid URL')
        }

        innerRef.current?.focus()
      }
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
        values={urls}
        onChange={handleChange}
        dataTestId={dataTestId}
        dataTrackingId={dataTrackingId}
      >
        {({ onAdd }) => (
          <Stack gap="2" width="96">
            <FormField hasError={hasError}>
              <Input
                ref={inputRef}
                iconLeft={
                  <Icon name="global" fill="solid" color="brand" size="md" />
                }
                onBlur={onBlur}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown(onAdd)}
                placeholder="website.com"
                value={current}
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

export { UrlMultivalue }
