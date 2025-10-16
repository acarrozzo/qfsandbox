import type { UseUploadWidgetProps } from '@mntn-dev/files-adapter-client'
import { ReactFileTools } from '@mntn-dev/files-adapter-client'
import {
  type ErrorEvent,
  FileUploadError,
  type UploadWidgetEventHandler,
} from '@mntn-dev/files-shared'
import { useTranslation } from '@mntn-dev/i18n'
import { useToast } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

const { useUploadWidget: useBaseUploadWidget } = ReactFileTools(trpcReactClient)

export const useUploadWidget = (props: UseUploadWidgetProps) => {
  const { showToast } = useToast()
  const { t } = useTranslation(['files', 'toast'])

  const onError: UploadWidgetEventHandler<ErrorEvent> = (error) => {
    const fileUploadErrorMsg =
      error instanceof FileUploadError
        ? t(`files:error.upload.${error.code}`)
        : null

    showToast.error({
      title: t('toast:file.error.title'),
      body: t('toast:file.error.body', {
        msg:
          error.statusText || fileUploadErrorMsg || t('toast:file.error.title'),
      }),
      dataTestId: 'file-upload-error-toast',
      dataTrackingId: 'file-upload-error-toast',
    })
  }

  return useBaseUploadWidget({
    ...props,
    onError: props.onError ?? onError,
  })
}
