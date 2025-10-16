'use client'

import { type ReactNode, useRef } from 'react'

import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'
import {
  CardsCompact,
  getCardCompactHeight,
  type TestIds,
  useWindowVirtualizer,
} from '@mntn-dev/ui-components'
import { spacingToPixels } from '@mntn-dev/ui-theme'

import { ProjectListItem } from './project-list-item.tsx'

export type ProjectListProps = TestIds & {
  emptyState?: ReactNode
  onViewClick?: (project: ProjectListItemServiceModel) => void
  onArchiveClick?: (project: ProjectListItemServiceModel) => void
  onProjectCloseClick?: (project: ProjectListItemServiceModel) => void
  projects: ProjectListItemServiceModel[]
  virtualize?: boolean
}

export const ProjectList = ({
  dataTestId,
  dataTrackingId,
  emptyState,
  onViewClick,
  onArchiveClick,
  onProjectCloseClick,
  projects,
  virtualize = true,
}: ProjectListProps) => {
  const listRef = useRef<HTMLDivElement>(null)
  const [virtualizer, WindowVirtualizationProvider] = useWindowVirtualizer({
    count: projects.length,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    overscan: 5,
    estimateSize: getCardCompactHeight('lg'),
    gap: spacingToPixels('2'),
    enabled: virtualize,
  })

  const handleClick = (project: ProjectListItemServiceModel) => () => {
    onViewClick?.(project)
  }

  const handleArchiveClick = (project: ProjectListItemServiceModel) => () => {
    onArchiveClick?.(project)
  }

  const handleProjectCloseClick =
    (project: ProjectListItemServiceModel) => () => {
      onProjectCloseClick?.(project)
    }

  if (projects.length === 0) {
    return emptyState ?? null
  }

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <WindowVirtualizationProvider value={virtualizer}>
      <CardsCompact ref={listRef}>
        <div
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualItems.map((virtualItem) => {
            const project = projects[virtualItem.index]

            if (!project) {
              return null
            }

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${
                    virtualItem.start - virtualizer.options.scrollMargin
                  }px)`,
                }}
              >
                <ProjectListItem
                  dataTestId={`${dataTestId}-item-${project.projectId}`}
                  dataTrackingId={`${dataTrackingId}-item-${project.projectId}`}
                  project={project}
                  onClick={handleClick(project)}
                  onArchive={handleArchiveClick(project)}
                  onProjectClose={handleProjectCloseClick(project)}
                />
              </div>
            )
          })}
        </div>
      </CardsCompact>
    </WindowVirtualizationProvider>
  )
}
