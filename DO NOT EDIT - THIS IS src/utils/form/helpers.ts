import type { FieldErrors, FieldValues } from '@mntn-dev/forms'

/** For checking if a form is valid or not by checking if there are any errors. react-hook-form does expose a isValid bool but it does not always seem to be accurate. */
export const isFormInvalid = <TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>
): boolean => Object.keys(errors).length > 0
