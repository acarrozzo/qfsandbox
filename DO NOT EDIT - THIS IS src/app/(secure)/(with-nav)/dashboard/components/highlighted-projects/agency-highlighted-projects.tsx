'use client'

import { useMemo } from 'react'

import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { SectionHeader } from '@mntn-dev/app-ui-components/section-header'
import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { ProjectListSection } from '#components/projects/project-list/project-list-section.tsx'
import { ProjectHighlightList } from '~/components/projects/project-highlight-list/project-highlight-list.tsx'
import { ProjectList } from '~/components/projects/project-list/project-list.tsx'

import { useDashboardAgencyHighlightsSuspenseQuery } from '../../hooks/use-dashboard-agency-highlights-query.ts'
import { AgencyAwardedActions } from '../actions/agency-awarded-actions.tsx'
import { AgencyDraftActions } from '../actions/agency-draft-actions.tsx'
import { AgencySubmittedActions } from '../actions/agency-submitted-actions.tsx'
import { useDashboardTabOpportunityType } from '../tabs/use-dashboard-tabs.ts'
import { HighlightedProjectsSection } from './highlighted-projects-section.tsx'

export const AgencyHighlightedProjects = () => {
  const params = useQueryParams<'/dashboard'>()
  const tab = params.tab || 'all'
  const { opportunityType } = useDashboardTabOpportunityType(tab)

  const { t } = useTranslation('project-list')

  const router = useRouter()

  const { items: projects } = useDashboardAgencyHighlightsSuspenseQuery()

  const awarded = useMemo(
    () =>
      (projects ?? []).filter(
        (project) =>
          project.status === 'awarded' &&
          isNonEmptyArray(
            project.bids?.filter((bid) => bid.status === 'accepted')
          )
      ),
    [projects]
  )

  const opportunities = useMemo(
    () =>
      (projects ?? []).filter(
        (project) =>
          project.status === 'bidding_open' && (project.bids ?? []).length === 0
      ),
    [projects]
  )

  const submitted = useMemo(
    () =>
      (projects ?? []).filter(
        (project) =>
          project.status !== 'awarded' &&
          isNonEmptyArray(
            project.bids?.filter((bid) => bid.status === 'submitted')
          )
      ),
    [projects]
  )

  const draft = useMemo(
    () =>
      (projects ?? []).filter(
        (project) =>
          project.status === 'bidding_open' &&
          isNonEmptyArray(project.bids?.filter((bid) => bid.status === 'draft'))
      ),
    [projects]
  )

  const declined = useMemo(
    () =>
      (projects ?? []).filter(
        (project) =>
          project.status === 'bidding_open' &&
          isNonEmptyArray(
            project.bids?.filter((bid) => bid.status === 'declined')
          )
      ),
    [projects]
  )

  const handleProjectClick = (project: ProjectListItemServiceModel) => {
    router.push(
      route('/projects/:projectId').params({
        projectId: project.projectId,
      })
    )
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {opportunityType === 'active' ? (
        <>
          {isNonEmptyArray(awarded) && (
            <HighlightedProjectsSection
              dataTestId="awarded-projects-heading"
              title={t(
                'highlight-section-header.awarded-projects-agency.title'
              )}
            >
              <ProjectHighlightList
                dataTestId="awarded-projects"
                projects={awarded}
                onClick={handleProjectClick}
                actions={AgencyAwardedActions}
              />
            </HighlightedProjectsSection>
          )}
          {isNonEmptyArray(draft) && (
            <HighlightedProjectsSection
              dataTestId="draft-bids-heading"
              title={t('highlight-section-header.draft-bids.title')}
              subtitle={t('highlight-section-header.draft-bids.subtitle')}
            >
              <ProjectHighlightList
                dataTestId="draft-bids"
                projects={draft}
                onClick={handleProjectClick}
                actions={AgencyDraftActions}
              />
            </HighlightedProjectsSection>
          )}
          {isNonEmptyArray(submitted) && (
            <HighlightedProjectsSection
              dataTestId="submitted-bids-heading"
              title={t('highlight-section-header.submitted-bids.title')}
              subtitle={t('highlight-section-header.submitted-bids.subtitle')}
            >
              <ProjectHighlightList
                dataTestId="submitted-bids"
                projects={submitted}
                onClick={handleProjectClick}
                actions={AgencySubmittedActions}
              />
            </HighlightedProjectsSection>
          )}
          {isNonEmptyArray(opportunities) && (
            <ProjectListSection>
              <SectionHeader
                dataTestId="opportunities-heading"
                title={t('highlight-section-header.opportunities.title')}
                subtitle={t('highlight-section-header.opportunities.subtitle')}
              />
              <ProjectList
                dataTestId="opportunities"
                projects={opportunities}
                onViewClick={handleProjectClick}
              />
            </ProjectListSection>
          )}
        </>
      ) : (
        <ProjectListSection>
          <SectionHeader
            dataTestId="dismissed-opportunities-heading"
            title={t('highlight-section-header.dismissed-opportunities.title')}
            subtitle={t(
              'highlight-section-header.dismissed-opportunities.subtitle'
            )}
          />
          <ProjectList
            dataTestId="dismissed-opportunities"
            projects={declined}
            onViewClick={handleProjectClick}
          />
        </ProjectListSection>
      )}
    </div>
  )
}
