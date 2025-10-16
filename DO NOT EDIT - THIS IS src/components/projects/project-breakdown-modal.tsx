'use client'

import type { ProjectId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Modal,
  ModalOverlineHeader,
  type ModalProps,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { pick } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useProjectPricing } from '~/utils/pricing/use-project-pricing.ts'

type ProjectBreakdownModalProps = Pick<ModalProps, 'open' | 'onClose'> & {
  projectId: ProjectId
}

const ProjectBreakdownModal = ({
  projectId,
  ...modalProps
}: ProjectBreakdownModalProps) => {
  const { t } = useTranslation(['generic'])

  const [data] =
    trpcReactClient.projects.getProjectDetailsPayloadById.useSuspenseQuery({
      projectId,
    })

  if (data.mode !== 'full') {
    throw new Error('Project is redacted')
  }
  const { project } = data

  const {
    projectBreakdownMaker,
    projectBreakdownBrand,
    projectPriceBrand,
    projectPriceMaker,
  } = useProjectPricing(project)

  return (
    <Modal
      {...modalProps}
      id="project-finance-breakdown-modal"
      dataTestId="project-finance-breakdown-modal"
      className="w-222"
    >
      <Modal.Overline>
        <ModalOverlineHeader
          dataTestId="package-quickview-modal-header"
          dataTrackingId="package-quickview-modal-header"
        >
          <ModalOverlineHeader.Main>
            <ModalOverlineHeader.Overline>
              <ModalOverlineHeader.OverlineLink onClick={modalProps.onClose}>
                {t('back', { ns: 'generic' })}
              </ModalOverlineHeader.OverlineLink>
            </ModalOverlineHeader.Overline>
          </ModalOverlineHeader.Main>
        </ModalOverlineHeader>
      </Modal.Overline>
      <Surface className="h-160 w-full overflow-auto" padding="4">
        <Text fontSize="lg" fontWeight="medium" textColor="secondary">
          {JSON.stringify(
            {
              projectBreakdownMaker,
              projectBreakdownBrand,
              projectPriceBrand,
              projectPriceMaker,
              project: pick(project, ['costMarginPercent', 'package']),
            },
            null,
            2
          )}
        </Text>
      </Surface>
    </Modal>
  )
}

export { ProjectBreakdownModal, type ProjectBreakdownModalProps }
