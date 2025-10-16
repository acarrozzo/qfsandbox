/**
 * Capitalize first letter of each word in a string
 */
export const title = (text: string) => {
  return text
    .split(' ')
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    )
    .join(' ')
}

/**
 * Capitalize first letter of a string
 */
export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
}

/**
 * Transform camelcase string to title
 */
export const camelcaseToTitle = (text: string) => {
  const result = text.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)
  return finalResult
}

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, limit = 16) =>
  text.length > limit ? `${text.slice(0, limit).trimEnd()}...` : text
