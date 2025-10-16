import type {
  DeliverableDomainQueryModel,
  DeliverableId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service'
import {
  Blade,
  type IconName,
  Tag,
  type TagType,
} from '@mntn-dev/ui-components'
import type { AnyValue } from '@mntn-dev/utility-types'

import { getDeliverableTagConfig } from '#components/deliverables/get-deliverable-tag-config.ts'
import { canViewPostProdDeliverableDetails } from '#utils/project/rounds-helpers.ts'

const RenderTag = ({
  type,
  text,
  iconName,
  deliverableId,
}: {
  type: TagType
  text: string
  iconName?: IconName
  deliverableId: DeliverableId
}) => (
  <Blade.Column>
    <Blade.Tag>
      <Tag
        type={type}
        variant="secondary"
        icon={iconName ? { name: iconName } : undefined}
        dataTestId={`deliverable-tag-${deliverableId}-${type}`}
        dataTrackingId={`deliverable-tag-${deliverableId}-${type}`}
      >
        {text}
      </Tag>
    </Blade.Tag>
  </Blade.Column>
)

export const ProjectMediaBladeTag = (props: {
  review?: PostProductionSelectReviewOutput
  project: ProjectWithAcl
  deliverable: DeliverableDomainQueryModel
}) => {
  const { t } = useTranslation(['generic', 'post-production-review'])
  const { deliverable, project, review } = props
  const deliverableId = deliverable.deliverableId

  if (
    !(review && canViewPostProdDeliverableDetails(review, deliverable, project))
  ) {
    return
  }

  const config = getDeliverableTagConfig({ ...props })
  if (!config) {
    return null
  }

  //  todo: try swapping AnyValue for something like:
  //   type PostProdTranslationKeys = keyof CustomTypeOptions['resources']['post-production-review']
  const text = t(
    config.textKey as AnyValue,
    config.textParams &&
      Object.fromEntries(
        Object.entries(config.textParams).map(([key, value]) => [
          key,
          t(value as AnyValue),
        ])
      )
  )
  return <RenderTag {...config} text={text} deliverableId={deliverableId} />
}
