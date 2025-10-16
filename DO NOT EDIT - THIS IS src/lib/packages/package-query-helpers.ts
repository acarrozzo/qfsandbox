import { type PackageId, PackageUrn } from '@mntn-dev/domain-types'
import type { GetFileListInput } from '@mntn-dev/files-shared'

export const getPackageFileQueryInputs = (
  packageId: PackageId
): GetFileListInput => {
  return {
    where: {
      folderUrn: PackageUrn(packageId),
    },
    orderBy: {
      column: 'uploadTimestamp',
      direction: 'asc',
    },
  }
}
