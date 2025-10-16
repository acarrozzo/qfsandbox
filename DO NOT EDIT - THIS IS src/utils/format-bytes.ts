const UNITS = [
  'byte',
  'kilobyte',
  'megabyte',
  'gigabyte',
  'terabyte',
  'petabyte',
] as const

const getValueAndUnit = (bytes: number) => {
  const i = Math.min(
    bytes <= 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1
  )
  const value = Number.parseFloat((bytes / 1024 ** i).toFixed(2))
  return { value, unit: UNITS[i] }
}

export const formatBytes = (bytes: number) => {
  const { value, unit } = getValueAndUnit(bytes)

  return Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
    style: 'unit',
    unit,
    unitDisplay: 'narrow',
  }).format(value)
}
