import Image from 'next/image'
import type React from 'react'

import type { FileId } from '@mntn-dev/domain-types'
import type {
  CropMode,
  ImageTransformationOptions,
} from '@mntn-dev/files-shared'
import { getTestProps, type TestIds } from '@mntn-dev/ui-components'

import { getFileImageProxyUrl } from '~/utils/client/file-utilities.ts'

type TransformOptions = Omit<
  ImageTransformationOptions,
  'width' | 'height' | 'crop'
>

type NextImageProps = React.ComponentProps<typeof Image>

type ImageProps = Omit<NextImageProps, 'width' | 'height' | 'alt' | 'src'>

type FileImageProps = Readonly<
  {
    fileId: FileId

    alt: string
    crop?: CropMode
    fill?: boolean
    height: number
    transformOptions?: TransformOptions
    width: number
  } & ImageProps &
    TestIds
>

export const FileImage = ({
  alt,
  crop,
  fileId,
  fill,
  height,
  transformOptions,
  width,
  dataTestId,
  dataTrackingId,
  ...imageProps
}: FileImageProps) => {
  const imageTransformationOptions: ImageTransformationOptions = {
    ...transformOptions,
    crop,
    height,
    width,
  }

  const src = getFileImageProxyUrl({
    fileId,
    options: imageTransformationOptions,
  })

  const nextImageProps: NextImageProps = {
    ...imageProps,
    alt,
    src,
    fill,
    ...(!fill && {
      height,
      width,
    }),
  }

  return (
    <Image
      {...nextImageProps}
      src={src}
      {...getTestProps({ dataTestId, dataTrackingId })}
    />
  )
}
