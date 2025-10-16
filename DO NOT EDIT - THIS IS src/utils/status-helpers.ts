import type { PascalCase } from 'type-fest'

type Evaluated<Status extends string> = Partial<
  Record<`is${PascalCase<Status>}`, boolean>
>

/**
 * A convenience helper for turning a status into a boolean for simplifying rendering logic.
 *
 * @param status - the status that will be set to true
 * @returns a record with only one status set to true but provides type hinting for the falsy statuses
 */
export const evaluateStatus = <Status extends string>(status: Status) => {
  const pascalCase = status
    .split(/[ -_]/)
    .map(([firstChar = '', ...rest]) => firstChar.toUpperCase() + rest.join(''))
    .join('')

  return { [`is${pascalCase}`]: true } as Evaluated<Status>
}
