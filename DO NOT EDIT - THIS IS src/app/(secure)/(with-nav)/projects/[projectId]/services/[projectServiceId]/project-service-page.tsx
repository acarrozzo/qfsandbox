'use client'

import type {
  GetProjectServiceByIdWithProjectModel,
  ProjectServiceWithAcl,
} from '@mntn-dev/project-service'
import type { PreProductionSelectReviewOutput } from '@mntn-dev/review-service'
import { SidebarLayoutContent } from '@mntn-dev/ui-components'

import { ServiceDetails } from '~/components/services/service-details/service-details.tsx'
import type { ComponentProps } from '~/types/props.ts'

type ProjectServicePageProps = ComponentProps<{
  initialService: ProjectServiceWithAcl<GetProjectServiceByIdWithProjectModel>
  initialReview?: PreProductionSelectReviewOutput
}>

export const ProjectServicePage = ({
  initialService,
}: ProjectServicePageProps) => {
  return (
    <SidebarLayoutContent>
      <ServiceDetails initialService={initialService} />
    </SidebarLayoutContent>
  )
}
