/** Validation functions to plugin into react-hook-form validation */
import type { VideoDuration } from '@mntn-dev/domain-types'
import type { ValidateResult } from '@mntn-dev/forms'

export const isPositiveNumber: (
  message: string,
  optional?: boolean
) => (
  v: number | undefined | null
) => ValidateResult | Promise<ValidateResult> =
  (message, optional) => (value) =>
    optional === true && (value === undefined || value === null)
      ? true
      : (value && Number(value) > 0) || message

export const isPositiveInteger: (
  message: string,
  optional?: boolean
) => (
  v: VideoDuration | undefined | null
) => ValidateResult | Promise<ValidateResult> =
  (message, optional) => (value) =>
    optional === true && (value === undefined || value === null)
      ? true
      : (value && Number.isInteger(Number(value)) && Number(value) > 0) ||
        message
