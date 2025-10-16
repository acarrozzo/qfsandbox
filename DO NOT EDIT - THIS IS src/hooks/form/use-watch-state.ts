import { type Dispatch, type SetStateAction, useEffect } from 'react'

import type { FieldValues, Path, UseFormReturn } from '@mntn-dev/forms'

/**
 * useWatchState is a hook that watches a field in a form and sets a state value to the watched value.
 * This is useful when you want to keep a state value in sync with a form field.
 */
export function useWatchState<TFormValues extends FieldValues, T>(
  form: UseFormReturn<TFormValues>,
  fieldName: Path<TFormValues>,
  [value, setValue]: [T, Dispatch<SetStateAction<T>>]
) {
  const watchedValue = form.watch(fieldName)

  useEffect(() => {
    if (value !== watchedValue) {
      setValue(watchedValue)
    }
  }, [value, watchedValue, setValue])
}
