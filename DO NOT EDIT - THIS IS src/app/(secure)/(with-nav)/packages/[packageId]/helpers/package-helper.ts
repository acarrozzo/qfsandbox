import type { FileListItem } from '@mntn-dev/file-service'
import type { PackageDomainQueryModelWithAcl } from '@mntn-dev/package-service/client'

export const isPackageReadonly = ({
  acl: { canUpdatePackage, canPatchPackage },
}: PackageDomainQueryModelWithAcl) => !(canUpdatePackage || canPatchPackage)

export const hasPackageVideo = (files: FileListItem[]) => {
  return files?.length && files.some((file) => file.category === 'video')
}

export const hasPackageVideoTitles = (files: FileListItem[]) => {
  return files?.length && files.every((file) => file.title)
}
