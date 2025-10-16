'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import type { RedactedProject } from '@mntn-dev/project-service'
import {
  Button,
  Editable,
  Icon,
  PageHeader,
  SidebarLayoutContent,
  SidebarLayoutFooter,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { first } from '@mntn-dev/utilities'

import { ProjectOverline } from '~/components/projects/project-overline.tsx'
import { ProjectResponsiveLayout } from '~/components/projects/project-responsive-layout.tsx'

import { useProjectDetailsPayload } from '../hooks/use-project-details-payload.ts'
import { ProjectFooterLayout } from './components/project-footer/project-footer-layout.tsx'

type Props = {
  project: RedactedProject
}

export const ExpiredProjectPage = ({ project: initialProject }: Props) => {
  const router = useRouter()
  const { t } = useTranslation(['projects', 'project-footer'])
  const { projectId } = initialProject

  const { project } = useProjectDetailsPayload({
    project: initialProject,
    mode: 'redacted',
  })

  const bid = first(project.bids)

  const handleViewBidClick = () => {
    if (bid) {
      router.push(
        route('/projects/:projectId/bid/:bidId').params({
          projectId,
          bidId: bid.bidId,
        })
      )
    }
  }

  return (
    <>
      <SidebarLayoutContent>
        <PageHeader dataTestId="expired-project-details-page-header">
          <PageHeader.Main>
            <PageHeader.Overline>
              <ProjectOverline
                projectStatus="expired"
                packageName={project.inherited.package.name}
                onBack={() => router.backOrPush(route('/dashboard'))}
                projectId={projectId}
              />
            </PageHeader.Overline>
            <Editable
              initialValue={project.name}
              placeholder={project.inherited.package.name}
              readOnly
              dataTestId="expired-project-name-editable"
              className="header-title"
            />
          </PageHeader.Main>
        </PageHeader>

        <ProjectResponsiveLayout
          main={
            <Surface padding="4">
              <Surface.Body>
                <Stack gap="4" alignItems="center">
                  <Icon name="error-warning" color="tertiary" size="xl" />
                  <Text fontSize="base" fontWeight="bold">
                    {t('projects:banners.project-expired-for-maker')}
                  </Text>
                </Stack>
              </Surface.Body>
            </Surface>
          }
        />
      </SidebarLayoutContent>

      {bid && (
        <SidebarLayoutFooter>
          <ProjectFooterLayout
            left={null}
            right={
              <Button
                className="w-60"
                variant="secondary"
                onClick={handleViewBidClick}
              >
                {t('project-footer:maker.project-expired-footer.view-bid')}
              </Button>
            }
          />
        </SidebarLayoutFooter>
      )}
    </>
  )
}
