import {
  type AgreementDomainSelectModel,
  isCustomService,
  type ProjectDomainSelectModel,
  servicesWithDeliverables,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { logger } from '@mntn-dev/logger'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { Modal, ModalOverlineHeader } from '@mntn-dev/ui-components'

import { ProjectSubmissionActions } from '#projects/[projectId]/components/project-submission/project-submission-actions.tsx'
import { ProjectSubmissionDeliverableReview } from '#projects/[projectId]/components/project-submission/project-submission-deliverable-review.tsx'
import { ProjectSubmissionDetailReview } from '#projects/[projectId]/components/project-submission/project-submission-detail-review.tsx'
import { useInitialProjectQueryData } from '#projects/providers/project-initial-data-provider.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefetchProject } from '~/components/projects/use-refetch-project.ts'
import { useRefetchProjectServices } from '~/components/services/use-refetch-project-services'

export const ProjectSubmissionModal = ({
  onClose,
  open,
  setSubmittedProject,
}: {
  onClose: () => void
  open?: boolean
  setSubmittedProject: (
    project: Pick<ProjectWithAcl, 'projectId' | 'status'>
  ) => void
}) => {
  const { t } = useTranslation(['projects'])
  const initialData = useInitialProjectQueryData()
  const projectId = initialData.project.projectId
  const projectQuery = trpcReactClient.projects.get.useQuery(projectId, {
    initialData: { project: initialData.project },
  })
  const { project } = projectQuery.data

  const agreementQuery =
    trpcReactClient.projects.getLatestAgreementVersion.useQuery({
      type: 'project-statement-of-work',
    })

  const agreement =
    agreementQuery.data as AgreementDomainSelectModel<'project-statement-of-work'>

  const { data: projectServices } =
    trpcReactClient.projects.getProjectServicesByProjectId.useQuery(projectId, {
      initialData: initialData.services,
    })
  const customServices = projectServices?.filter(isCustomService) || []
  const deliverables = servicesWithDeliverables(projectServices)

  const refetchProject = useRefetchProject()
  const refetchProjectServices = useRefetchProjectServices({ projectId })

  const setProjectBiddingOpen =
    trpcReactClient.projects.setProjectBiddingOpen.useMutation()

  const handleSubmitComplete = async (project: ProjectDomainSelectModel) => {
    await refetchProject(project)
    await refetchProjectServices()
    setSubmittedProject(project)
    onClose()
  }

  const handleSubmitProject = async () => {
    if (project.acl.canSubmitProject) {
      handleSubmitComplete(
        await setProjectBiddingOpen.mutateAsync({
          projectId,
        })
      )
    }
  }

  if (!(agreement || agreementQuery.isLoading)) {
    // todo: show toast
    logger.error('No agreement found for project submission')
    return
  }

  return (
    agreement && (
      <Modal
        id={`project-submission-modal-${project.projectId}`}
        open={open}
        onClose={onClose}
        dataTestId={`project-submission-modal-${project.projectId}`}
      >
        <Modal.Overline>
          <ModalOverlineHeader>
            <ModalOverlineHeader.Main>
              <ModalOverlineHeader.Overline
                dataTestId={`project-submission-modal-title-info-${project.projectId}`}
              >
                <ModalOverlineHeader.OverlineLink
                  onClick={onClose}
                  dataTestId={`project-submission-modal-back-${project.projectId}`}
                >
                  {t('projects:review-project-for-submission')}
                </ModalOverlineHeader.OverlineLink>
              </ModalOverlineHeader.Overline>
              <ModalOverlineHeader.Title title={project.name} />
            </ModalOverlineHeader.Main>
          </ModalOverlineHeader>
        </Modal.Overline>
        <div className="flex gap-4 h-[800px] self-start w-full">
          <div className="w-7/12">
            <ProjectSubmissionDetailReview
              project={project}
              services={projectServices}
            />
          </div>
          <div className="flex flex-col w-5/12 gap-4">
            <ProjectSubmissionDeliverableReview deliverables={deliverables} />

            <ProjectSubmissionActions
              agreement={agreement}
              project={project}
              customServiceCount={customServices.length}
              onSubmitProject={handleSubmitProject}
              isLoading={setProjectBiddingOpen.isPending}
            />
          </div>
        </div>
      </Modal>
    )
  )
}
