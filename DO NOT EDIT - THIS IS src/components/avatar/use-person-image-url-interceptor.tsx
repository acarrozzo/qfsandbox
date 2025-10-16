import { UrlSchema } from '@mntn-dev/domain-types'
import type { ImageTransformationOptions } from '@mntn-dev/files-shared'
import type { Person } from '@mntn-dev/ui-components'
import { satisfiesSchema } from '@mntn-dev/utility-types'

import { getFileImageProxyUrl } from '~/utils/client/file-utilities.ts'

export const usePersonImageUrlInterceptor = (
  person: Person,
  options?: ImageTransformationOptions
) => {
  const avatarUrl = satisfiesSchema(UrlSchema, person.avatarUrl)
    ? person.avatarUrl
    : person.avatarFileId &&
      getFileImageProxyUrl({
        fileId: person.avatarFileId,
        options: {
          height: 200,
          width: 200,
          gravity: 'custom',
          crop: 'thumb',
          ...options,
        },
      })

  return { person: { ...person, avatarUrl } }
}
