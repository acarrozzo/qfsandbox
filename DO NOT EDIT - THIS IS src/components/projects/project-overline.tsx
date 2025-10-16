import type { MouseEvent } from 'react'

import { PartnerProgramLogo } from '@mntn-dev/app-ui-components/partner-program-logo'
import { ProjectStatusTag } from '@mntn-dev/app-ui-components/project-status-tag'
import type {
  PackageSource,
  ProjectId,
  ProjectStatus,
} from '@mntn-dev/domain-types'
import { PageHeader, Text, useOpenState } from '@mntn-dev/ui-components'

import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { ProjectBreakdownModal } from './project-breakdown-modal.tsx'

const ProjectOverline = ({
  projectStatus,
  packageName,
  packageSource,
  onBack,
  projectId,
}: {
  projectStatus: ProjectStatus | 'expired'
  packageName: string
  packageSource?: PackageSource
  onBack: () => void
  projectId: ProjectId
}) => {
  const modalOpenState = useOpenState()
  const { hasPermission } = usePermissions()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.metaKey) {
      modalOpenState.onToggle()
    }
  }

  return (
    <>
      <PageHeader.OverlineLink onClick={onBack} />
      <div className="flex items-center gap-2">
        <ProjectStatusTag status={projectStatus} />

        {packageSource && (
          <PartnerProgramLogo
            partnerProgram={packageSource}
            size="sm"
            withTooltip
          />
        )}

        <Text
          fontSize="lg"
          textColor="secondary"
          onClick={
            hasPermission('project:administer') ? handleClick : undefined
          }
          className="cursor-default"
        >
          {packageName || ''}
        </Text>

        <ProjectBreakdownModal {...modalOpenState} projectId={projectId} />
      </div>
    </>
  )
}

export { ProjectOverline }
