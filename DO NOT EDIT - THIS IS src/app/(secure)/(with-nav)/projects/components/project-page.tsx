'use client'

import { useState } from 'react'

import { useQueryParams } from '@mntn-dev/app-navigation'
import {
  isCustomerOrganizationType,
  isProjectWithStatus,
  servicesWithDeliverables,
} from '@mntn-dev/domain-types'
import { type SubmitHandler, useFormContext } from '@mntn-dev/forms'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { SidebarLayoutContent } from '@mntn-dev/ui-components'

import { ProjectFooter } from '#projects/[projectId]/components/project-footer/project-footer.tsx'
import { ProjectPageHeader } from '#projects/[projectId]/components/project-page-header.tsx'
import { ProjectSubmissionModal } from '#projects/[projectId]/components/project-submission/project-submission-modal.tsx'
import { ProjectMain } from '#projects/[projectId]/project-main.tsx'
import { useInitialProjectQueryData } from '#projects/providers/project-initial-data-provider.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { ProjectResponsiveLayout } from '~/components/projects/project-responsive-layout.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'

import { ProjectSubmittedCelebrationModal } from '../[projectId]/components/project-submission/project-submitted-celebration-modal.tsx'
import { ProjectSidebar } from '../[projectId]/project-sidebar.tsx'
import { useEditProjectToggle } from '../hooks/use-edit-project-toggle.ts'
import { useProjectDetailsPayload } from '../hooks/use-project-details-payload.ts'
import { useSubmitProjectValidator } from '../hooks/use-submit-project-validator.ts'
import { ProjectCompletedSurveyPrompter } from './project-completed-survey-prompter.tsx'

const PROJECT_FORM_ID = 'project-form'

export const ProjectPage = () => {
  const initialData = useInitialProjectQueryData()
  const projectId = initialData.project.projectId
  const { me } = useMe()

  const { tab } = useQueryParams<'/projects/:projectId'>()
  const currentTab = tab ?? 'details'

  useProjectDetailsPayload({ project: initialData.project, mode: 'full' })

  const {
    data: { project },
  } = trpcReactClient.projects.get.useQuery(projectId, {
    initialData: { project: initialData.project },
  })

  const { data: projectServices } =
    trpcReactClient.projects.getProjectServicesByProjectId.useQuery(projectId, {
      initialData: initialData.services,
    })

  const { data: preProductionReviews = [] } =
    trpcReactClient.reviews.preProduction.selectReviewsForProject.useQuery(
      {
        projectId,
      },
      {
        initialData: initialData.preProductionReviews,
      }
    )

  const { handleSubmit } = useFormContext<ProjectWithAcl>()
  const { validate } = useSubmitProjectValidator()

  const [showReviewModal, setShowReviewModal] = useState(false)

  const [submittedProject, setSubmittedProject] = useState<
    Pick<ProjectWithAcl, 'projectId' | 'status'> | undefined
  >()

  const handleCelebrationModalClose = () => setSubmittedProject(undefined)

  const onSubmit: SubmitHandler<ProjectWithAcl> = () => {
    validate(project, projectServices) && setShowReviewModal(true)
  }

  const { isEditing, toggleEditing } = useEditProjectToggle(project)

  return (
    <>
      <SidebarLayoutContent>
        <form id={PROJECT_FORM_ID} onSubmit={handleSubmit(onSubmit)}>
          <ProjectPageHeader
            isEditing={isEditing}
            onToggleEditing={toggleEditing}
          />

          <ProjectResponsiveLayout
            main={
              <ProjectMain
                currentTab={currentTab}
                isEditing={isEditing}
                project={project}
                projectServices={projectServices}
                preProductionReviews={preProductionReviews}
              />
            }
            sidebar={
              currentTab === 'details' && (
                <ProjectSidebar
                  project={project}
                  deliverableServices={servicesWithDeliverables(
                    projectServices
                  )}
                />
              )
            }
          />
        </form>
      </SidebarLayoutContent>

      <ProjectFooter formId={PROJECT_FORM_ID} />

      {showReviewModal && (
        <ProjectSubmissionModal
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          setSubmittedProject={setSubmittedProject}
        />
      )}

      {submittedProject && (
        <ProjectSubmittedCelebrationModal
          project={submittedProject}
          onClose={handleCelebrationModalClose}
        />
      )}

      {isProjectWithStatus(project, 'complete') &&
        isCustomerOrganizationType(me.organizationType) && (
          <ProjectCompletedSurveyPrompter
            project={project}
            organizationType={me.organizationType}
          />
        )}
    </>
  )
}
