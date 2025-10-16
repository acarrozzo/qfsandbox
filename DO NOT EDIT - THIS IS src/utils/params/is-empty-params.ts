import type { UnknownRecord } from 'type-fest'

/**
 * This function helps us determine if an object is practically "empty".
 * It is useful for things like checking if a query params object which
 * only includes falsy-keys (null/undefined/empty-string) or nothing at all.
 *
 * Worth noting it does not check recursively, any key pointing to something like an object is not considered empty.
 *
 * @param params an object type with various keys and values
 * @returns a boolean representing whether params was empty-like
 */
export const isEmptyParams = (params: UnknownRecord) => {
  const values = Object.values(params)
  return !values.length || values.every((value) => !value)
}
