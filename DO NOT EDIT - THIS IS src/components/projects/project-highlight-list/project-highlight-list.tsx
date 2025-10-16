'use client'

import type { ReactNode } from 'react'

import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'
import { Cards } from '@mntn-dev/ui-components'

import {
  ProjectHighlightListItem,
  type ProjectHighlightListItemProps,
} from './project-highlight-list-item.tsx'

type ProjectHighlightListProps = Omit<
  ProjectHighlightListItemProps,
  'onClick' | 'project'
> & {
  emptyState?: ReactNode
  onClick?: (project: ProjectListItemServiceModel) => void
  projects?: ProjectListItemServiceModel[]
}

export const ProjectHighlightList = ({
  actions,
  dataTestId,
  dataTrackingId,
  emptyState,
  onClick,
  projects,
}: ProjectHighlightListProps) => {
  if (!projects) {
    return emptyState ?? null
  }

  const handleClick = (project: ProjectListItemServiceModel) => () => {
    onClick?.(project)
  }

  return (
    <Cards dataTestId={dataTestId} dataTrackingId={dataTrackingId}>
      {projects.map((project) => (
        <ProjectHighlightListItem
          key={project.projectId}
          dataTestId={`${dataTestId}-item-${project.projectId}`}
          dataTrackingId={`${dataTrackingId}-item-${project.projectId}`}
          project={project}
          onClick={handleClick(project)}
          actions={actions}
        />
      ))}
    </Cards>
  )
}
