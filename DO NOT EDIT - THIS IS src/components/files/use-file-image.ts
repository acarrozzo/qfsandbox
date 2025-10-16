import type Image from 'next/image'
import type { ComponentProps } from 'react'

import type { FileId } from '@mntn-dev/domain-types'
import type {
  CropMode,
  ImageTransformationOptions,
} from '@mntn-dev/files-shared'

import { getFileImageProxyUrl } from '~/utils/client/file-utilities.ts'

type NextImageProps = ComponentProps<typeof Image>

type ImageProps = Omit<NextImageProps, 'width' | 'height' | 'alt' | 'src'>

type TransformOptions = Omit<
  ImageTransformationOptions,
  'width' | 'height' | 'crop'
>

export type UseFileImageProps = Readonly<
  {
    fileId?: FileId
    crop?: CropMode
    fill?: boolean
    height: number
    transformOptions?: TransformOptions
    width: number
  } & ImageProps
>

export const useFileImage = ({
  crop,
  height,
  fileId,
  transformOptions,
  width,
}: UseFileImageProps) => {
  const imageTransformationOptions: ImageTransformationOptions = {
    ...transformOptions,
    crop,
    height,
    width,
  }

  if (!fileId) {
    return undefined
  }

  return getFileImageProxyUrl({
    fileId,
    options: imageTransformationOptions,
  })
}
