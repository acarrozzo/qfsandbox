import { formatDate } from '@mntn-dev/utilities'

export const getValidDate = (date: string | Date | undefined) => {
  if (!date) {
    return null
  }
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

export const extractDate = (input?: Date) => {
  const [date, _time] = input?.toISOString().split('T') ?? []
  return date
}

export const getDateTimeString = (date?: Date) => {
  const validDate = date ? new Date(date) : new Date()
  if (Number.isNaN(validDate.getTime())) {
    return undefined
  }

  return validDate.toISOString()
}

export const getTomorrow = () => {
  return new Date(new Date().setDate(new Date().getDate() + 1))
}

// format as YYYY-MM-DD HH:mm:ss
export const getFullDateTimeString = (date?: Date) => {
  const validDate = getValidDate(date)
  return validDate ? formatDate(validDate, 'iso-like-alt') : undefined
}
