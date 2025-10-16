import { useTranslation } from '@mntn-dev/i18n'
import { Modal, PageHeader, Stack } from '@mntn-dev/ui-components'

import type { ComponentProps } from '~/types/props.ts'

type Props = ComponentProps<{
  onClose: () => void
}>

export const FilePreviewHeader = ({ onClose }: Props) => {
  const { t } = useTranslation(['file-manager', 'generic'])

  return (
    <Stack alignItems="center" justifyContent="between">
      <Modal.Overline>
        <PageHeader
          dataTestId="file-preview-header"
          dataTrackingId="file-preview-header"
        >
          <PageHeader.Main>
            <PageHeader.Overline>
              <PageHeader.OverlineLink onClick={onClose}>
                {t('generic:exit')}
              </PageHeader.OverlineLink>
            </PageHeader.Overline>
            <PageHeader.Title title={t('file-manager:preview')} />
          </PageHeader.Main>
        </PageHeader>
      </Modal.Overline>
    </Stack>
  )
}
