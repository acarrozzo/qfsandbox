import { env } from '@mntn-dev/env'
import { runningOnServer } from '@mntn-dev/utilities'

export const getClientBaseUrl = () => {
  return runningOnServer() ? env.BASE_URL : window.location.origin
}

export const getClientRouteUrl = (...path: string[]) => {
  const fullPath = path.join('/')
  return `${getClientBaseUrl()}/${fullPath}`
}

export const getClientFilesApiUrl = (...path: string[]) => {
  const fullPath = path.join('/')
  return `${getClientBaseUrl()}/api/files/${fullPath}`
}
