import { H } from '@highlight-run/next/client'

import type { UserDomainQueryModel } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import type { AnyRecord } from '@mntn-dev/utility-types'

import { getAvatarProxyUrl } from '~/utils/client/file-utilities.ts'

/**
 * a function that identifies a user to highlight.io
 *
 * @param user the user to identify to highlight.io
 */
export function identifyUser(user: UserDomainQueryModel) {
  const { userId, emailAddress: email, displayName: name } = user
  const avatar =
    user.avatarFileId &&
    getAvatarProxyUrl({
      userId,
      options: { width: 200, height: 200, gravity: 'custom', crop: 'thumb' },
    })

  const identityInfo: AnyRecord = { userId, email, name, avatar }

  logger.info(`Identifying user (${identityInfo.email})`, { identityInfo })
  H.identify(email, identityInfo)
}
