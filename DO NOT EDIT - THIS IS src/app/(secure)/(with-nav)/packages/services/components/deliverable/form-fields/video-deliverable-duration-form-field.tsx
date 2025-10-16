'use client'

import { useEffect, useState } from 'react'

import {
  isVideoDurationArray,
  isVideoDurationRange,
  type VideoDeliverableDetails,
  type VideoDuration,
  type VideoDurationOptions,
} from '@mntn-dev/domain-types'
import { useController } from '@mntn-dev/forms'
import { FormField, Input } from '@mntn-dev/ui-components'

import type { DeliverableFormFieldProps } from '../types.ts'
import { isDeliverableErrors } from '../utils.ts'

const parseDurationOption = (str: string): VideoDurationOptions => {
  const trimmed = str.trim()

  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10)
  }

  const match = trimmed.match(/^(\d+)\s*-\s*(\d+)$/)

  if (match) {
    const min = Number(match[1])
    const max = Number(match[2])

    if (Number.isNaN(min) || Number.isNaN(max)) {
      throw new Error(`Invalid numbers in range: "${str}"`)
    }

    if (min > max) {
      throw new Error(`Range min must be <= max in "${str}"`)
    }

    return { min, max }
  }

  throw new Error(`Invalid duration format: "${str}"`)
}

const parseDuration = (input: string): VideoDuration => {
  const parts = input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  if (parts.length === 0) {
    throw new Error('No durations provided')
  }

  const parsed = parts.map(parseDurationOption)

  if (parsed.length === 0) {
    throw new Error('No parsed durations')
  }

  if (parsed.length === 1) {
    const first = parsed[0]
    if (first === undefined) {
      throw new Error('Unexpected undefined in parsed[0]')
    }
    return first
  }

  return parsed as [VideoDurationOptions, ...VideoDurationOptions[]]
}

const formatDurationOption = (duration: VideoDurationOptions): string =>
  isVideoDurationRange(duration)
    ? `${duration.min}-${duration.max}`
    : `${duration}`

const formatDuration = (duration: VideoDuration | undefined): string => {
  if (duration === undefined) {
    return ''
  }

  return isVideoDurationArray(duration)
    ? duration.map(formatDurationOption).join(', ')
    : formatDurationOption(duration)
}

const DeliverableDurationFormField = ({
  deliverableIndex,
  control,
  errors,
  isTriggered,
  t,
  isDisabled,
}: DeliverableFormFieldProps) => {
  const name = `deliverables.${deliverableIndex}.duration` as const

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: true,
      validate: (val) => {
        if (typeof val !== 'string') {
          return true
        }
        try {
          parseDuration(val)
          return true
        } catch {
          return 'Invalid duration format. Use e.g., "15", "30-60", "15, 30-45".'
        }
      },
    },
  })

  const [inputValue, setInputValue] = useState(() =>
    typeof field.value === 'string' ? field.value : formatDuration(field.value)
  )

  useEffect(() => {
    if (typeof field.value !== 'string') {
      setInputValue(formatDuration(field.value))
    }
  }, [field.value])

  return (
    <FormField
      columnSpan={3}
      className="w-full"
      hasError={
        isTriggered &&
        errors.deliverables &&
        isDeliverableErrors<Array<VideoDeliverableDetails>>(errors) &&
        !!errors.deliverables[deliverableIndex]?.duration
      }
    >
      <FormField.Label>
        {t('deliverable-details:field.duration')}
      </FormField.Label>

      <FormField.Control>
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          onBlur={() => {
            try {
              const parsed = parseDuration(inputValue)
              field.onChange(parsed)
              setInputValue(formatDuration(parsed))
            } catch {
              field.onChange(inputValue) // triggers validation error
            }
            field.onBlur()
          }}
          disabled={isDisabled}
        />
        {error?.message && (
          <p className="text-red-500 text-sm">{error.message}</p>
        )}
      </FormField.Control>
    </FormField>
  )
}

export { DeliverableDurationFormField }
