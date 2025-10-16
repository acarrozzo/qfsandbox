'use client'

import { ProjectHighlightListLoading } from '~/components/projects/project-highlight-list/project-highlight-list-loading.tsx'

import { HighlightedProjectsSection } from './highlighted-projects-section.tsx'

export const HighlightedProjectsLoading = () => {
  return (
    <HighlightedProjectsSection title="Highlighted Projects">
      <ProjectHighlightListLoading />
    </HighlightedProjectsSection>
  )
}
