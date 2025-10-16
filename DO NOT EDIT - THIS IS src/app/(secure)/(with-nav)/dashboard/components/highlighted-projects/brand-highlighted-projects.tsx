'use client'

import { useMemo } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { ProjectHighlightList } from '~/components/projects/project-highlight-list/project-highlight-list.tsx'

import { useDashboardBrandHighlightsSuspenseQuery } from '../../hooks/use-dashboard-brand-highlights-query.ts'
import { BrandAwardedActions } from '../actions/brand-awarded-actions.tsx'
import { BrandReviewActions } from '../actions/brand-review-actions.tsx'
import { BrandSubmittedActions } from '../actions/brand-submitted-actions.tsx'
import { HighlightedProjectsSection } from './highlighted-projects-section.tsx'

export const BrandHighlightedProjects = () => {
  const router = useRouter()
  const { t } = useTranslation('project-list')
  const { items: projects } = useDashboardBrandHighlightsSuspenseQuery()

  const toReview = useMemo(
    () =>
      (projects ?? []).filter(
        (project) =>
          project.status === 'bidding_closed' &&
          isNonEmptyArray(
            project.bids?.filter((bid) => bid.status === 'submitted')
          )
      ),
    [projects]
  )
  const submitted = useMemo(
    () =>
      (projects ?? []).filter((project) => project.status === 'bidding_open'),
    [projects]
  )
  const awarded = useMemo(
    () => (projects ?? []).filter((project) => project.status === 'awarded'),
    [projects]
  )

  const handleProjectClick = (project: ProjectListItemServiceModel) => {
    router.push(
      route('/projects/:projectId').params({
        projectId: project.projectId,
      })
    )
  }

  const hasHighlights = useMemo(() => {
    return (
      isNonEmptyArray(toReview) ||
      isNonEmptyArray(submitted) ||
      isNonEmptyArray(awarded)
    )
  }, [toReview, submitted, awarded])

  if (!hasHighlights) {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {isNonEmptyArray(toReview) && (
        <HighlightedProjectsSection
          dataTestId="to-review-projects"
          title={t('highlight-section-header.to-review.title')}
          subtitle={t('highlight-section-header.to-review.subtitle')}
        >
          <ProjectHighlightList
            dataTestId="to-review-projects"
            projects={toReview}
            onClick={handleProjectClick}
            actions={BrandReviewActions}
          />
        </HighlightedProjectsSection>
      )}
      {isNonEmptyArray(submitted) && (
        <HighlightedProjectsSection
          dataTestId="submitted-projects"
          title={t('highlight-section-header.submitted-projects.title')}
          subtitle={t('highlight-section-header.submitted-projects.subtitle')}
        >
          <ProjectHighlightList
            dataTestId="submitted-projects"
            projects={submitted}
            onClick={handleProjectClick}
            actions={BrandSubmittedActions}
          />
        </HighlightedProjectsSection>
      )}
      {isNonEmptyArray(awarded) && (
        <HighlightedProjectsSection
          dataTestId="awarded-projects"
          title={t('highlight-section-header.awarded-projects-brand.title')}
          subtitle={t(
            'highlight-section-header.awarded-projects-brand.subtitle'
          )}
        >
          <ProjectHighlightList
            dataTestId="awarded-projects"
            projects={awarded}
            onClick={handleProjectClick}
            actions={BrandAwardedActions}
          />
        </HighlightedProjectsSection>
      )}
    </div>
  )
}
