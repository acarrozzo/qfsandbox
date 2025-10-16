import type { FocusEvent } from 'react'

import { getValidDate } from '~/utils/date-helpers.ts'

import type { HTMLFormFieldElement } from './types.ts'

export type FieldValueGetter = (
  event: FocusEvent<HTMLFormFieldElement>
  // biome-ignore lint/suspicious/noExplicitAny: form fields be associated can be of any type
) => any

export const textField: FieldValueGetter = (event) => event.target.value.trim()
export const dateField: FieldValueGetter = (event) =>
  getValidDate(event.target.value.trim())
