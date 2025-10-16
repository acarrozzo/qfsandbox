import type {
  FileId,
  OrganizationType,
  TeamDomainSelectModel,
} from '@mntn-dev/domain-types'
import type { AvatarBorderColor, AvatarEntity } from '@mntn-dev/ui-components'

import { getFileImageProxyUrl } from '~/utils/client/file-utilities.ts'

export const getAvatarUrl = (fileId?: FileId) =>
  fileId
    ? getFileImageProxyUrl({
        fileId: fileId,
        options: { width: 200, height: 200, gravity: 'custom', crop: 'thumb' },
      })
    : undefined

export const teamToAvatarEntity = ({
  avatarFileId,
  name,
}: TeamDomainSelectModel): AvatarEntity => ({
  displayName: name,
  initials: name.trim().slice(0, 1).toUpperCase(),
  avatarUrl: getAvatarUrl(avatarFileId),
})

export const organizationTypeBorderColorMap: Record<
  OrganizationType,
  AvatarBorderColor
> = {
  brand: 'info',
  agency: 'caution',
  internal: 'positive',
}
