import {
  type BidStatus,
  BidStatusSchema,
  type ProjectStatus,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag, type TagType } from '@mntn-dev/ui-components'
import type { ZodInfer } from '@mntn-dev/utility-types'

const ProjectBidStatusSchema = BidStatusSchema.extract([
  'accepted',
  'rejected',
  'submitted',
])
type ProjectBidStatus = ZodInfer<typeof ProjectBidStatusSchema>

const bidStatusTagTypeMap: Record<ProjectBidStatus, TagType> = {
  accepted: 'success',
  rejected: 'default',
  submitted: 'info',
}

export const ProjectBidStatusTag = ({
  bidStatus,
  projectStatus,
}: {
  bidStatus: BidStatus
  projectStatus: ProjectStatus
}) => {
  const { t } = useTranslation('project-bids-table')

  const projectBidStatus = ProjectBidStatusSchema.safeParse(bidStatus)

  if (!projectBidStatus.success) {
    return null
  }

  if (projectStatus === 'bidding_open') {
    return <Tag variant="primary">{t('submitted')}</Tag>
  }

  return (
    <Tag variant="primary" type={bidStatusTagTypeMap[projectBidStatus.data]}>
      {t(`review-status.${projectBidStatus.data}`)}
    </Tag>
  )
}
