import type { ReactNode } from 'react'

import {
  SectionHeader,
  type SectionHeaderProps,
} from '@mntn-dev/app-ui-components/section-header'
import type { TestIds } from '@mntn-dev/ui-components'

import { ProjectHighlightSection } from '#components/projects/project-highlight-list/project-highlight-section.tsx'

type HighlightedProjectsSectionProps = Pick<
  SectionHeaderProps,
  'title' | 'subtitle'
> &
  TestIds & { children: ReactNode }

export const HighlightedProjectsSection = ({
  children,
  dataTestId,
  dataTrackingId,
  subtitle,
  title,
}: HighlightedProjectsSectionProps) => {
  return (
    <ProjectHighlightSection>
      <SectionHeader
        dataTestId={dataTestId}
        dataTrackingId={dataTrackingId}
        title={title}
        subtitle={subtitle}
      />
      {children}
    </ProjectHighlightSection>
  )
}
