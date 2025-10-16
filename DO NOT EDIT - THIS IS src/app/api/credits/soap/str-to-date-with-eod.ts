import { endOfDay, isValid, parseISO } from '@mntn-dev/utilities'

/**
 * Converts a string to a Date.
 * - If the string includes a non-midnight time, it will be preserved.
 * - If the string has no time (or time is midnight), it is converted to the end of the day (23:59:59.999).
 * @param str - The string to convert to a date
 * @returns The Date representation of the string
 */
export const strToDateWithEOD = (str: string): Date => {
  let date: Date

  // Check if the original string had a time component (T followed by time)
  const hasTimeComponent =
    str.includes('T') || str.includes(' ') || str.includes(':')

  // Always use parseISO for consistent parsing
  // parseISO parses date-only strings as local midnight (e.g., '2024-07-15' -> 2024-07-15 00:00:00 local)
  // parseISO parses date-time strings according to their timezone
  try {
    date = parseISO(str)
    if (!isValid(date)) {
      date = new Date(str) // fallback
    }
  } catch {
    date = new Date(str)
  }

  if (!isValid(date)) {
    throw new Error('Invalid date string')
  }

  if (hasTimeComponent) {
    // Check if the original string had timezone info
    const hasTimezone =
      str.includes('Z') || str.includes('+') || /T.*[+-]\d{2}:\d{2}$/.test(str)

    // Check if the time is midnight (00:00:00.000)
    // Use UTC methods for timezone-aware dates, local methods for timezone-naive dates
    const isMidnight = hasTimezone
      ? date.getUTCHours() === 0 &&
        date.getUTCMinutes() === 0 &&
        date.getUTCSeconds() === 0 &&
        date.getUTCMilliseconds() === 0
      : date.getHours() === 0 &&
        date.getMinutes() === 0 &&
        date.getSeconds() === 0 &&
        date.getMilliseconds() === 0

    if (isMidnight) {
      // Midnight should be treated as "no time specified" - return end of day
      if (hasTimezone) {
        // Input had timezone info, return UTC end of day
        const utcEndOfDay = new Date(date)
        utcEndOfDay.setUTCHours(23, 59, 59, 999)
        return utcEndOfDay
      } else {
        // No timezone info, return local end of day
        return endOfDay(date)
      }
    } else {
      // Non-midnight time - preserve the exact time
      return date
    }
  }

  // No time component - return end of day
  // Check if the original string had timezone info
  const hasTimezone =
    str.includes('Z') || str.includes('+') || /T.*[+-]\d{2}:\d{2}$/.test(str)

  if (hasTimezone) {
    // Input had timezone info, return UTC end of day
    const utcEndOfDay = new Date(date)
    utcEndOfDay.setUTCHours(23, 59, 59, 999)
    return utcEndOfDay
  } else {
    // No timezone info, return local end of day
    return endOfDay(date)
  }
}
