'use client'

import type { ReactNode } from 'react'

import { SectionHeader } from '@mntn-dev/app-ui-components/section-header'
import { useTranslation } from '@mntn-dev/i18n'

import { ProjectListSection } from '#components/projects/project-list/project-list-section.tsx'

export const MyProjectsSection = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('dashboard')

  return (
    <ProjectListSection>
      <SectionHeader dataTestId="my-projects" title={t('my-projects.title')} />
      {children}
    </ProjectListSection>
  )
}
