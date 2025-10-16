'use client'

import { type ReactNode, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'

import { ProjectArchiver } from '#components/projects/project-archiver.tsx'
import { ProjectCloseModal } from '#components/projects/project-close-modal.tsx'
import { ProjectList } from '#components/projects/project-list/project-list.tsx'

import { useDashboardProjectsSuspenseQuery } from '../../hooks/use-dashboard-projects-query.ts'
import { ProjectListEmptyState } from '../empty-state/project-list-empty-state.tsx'

export const MyProjectsList = ({
  emptyState = <ProjectListEmptyState />,
}: {
  emptyState?: ReactNode
}) => {
  const { items: projects } = useDashboardProjectsSuspenseQuery()

  const [archiveProject, setArchiveProject] = useState<
    ProjectListItemServiceModel | undefined
  >(undefined)

  const [closeProject, setCloseProject] = useState<
    ProjectListItemServiceModel | undefined
  >(undefined)

  const router = useRouter()

  const handleProjectClick = (project: ProjectListItemServiceModel) => {
    router.push(
      route('/projects/:projectId').params({
        projectId: project.projectId,
      })
    )
  }

  const handleArchiveClick = (project: ProjectListItemServiceModel) => {
    setArchiveProject(project)
  }

  const handleCloseArchiver = () => {
    setArchiveProject(undefined)
  }

  const handleProjectCloseClick = (project: ProjectListItemServiceModel) => {
    setCloseProject(project)
  }

  const handleCloseProjectCloser = () => {
    setCloseProject(undefined)
  }

  return (
    <>
      <ProjectList
        dataTestId="my-projects"
        emptyState={emptyState}
        onViewClick={handleProjectClick}
        onArchiveClick={handleArchiveClick}
        onProjectCloseClick={handleProjectCloseClick}
        projects={projects}
      />
      {archiveProject && (
        <ProjectArchiver
          project={archiveProject}
          onConfirm={handleCloseArchiver}
          onClose={handleCloseArchiver}
        />
      )}
      {closeProject && (
        <ProjectCloseModal
          project={closeProject}
          onConfirm={handleCloseProjectCloser}
          onClose={handleCloseProjectCloser}
        />
      )}
    </>
  )
}
