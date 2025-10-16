import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import { List } from '@mntn-dev/ui-components'
import { isDefined } from '@mntn-dev/utilities'

export const ProjectSummary = ({
  project,
  projectServices,
}: {
  project: ProjectWithAcl
  projectServices: ProjectServiceWithAcl[]
}) => {
  const { t } = useTranslation('project-summary')

  const services = projectServices.filter(
    ({ serviceKey, deliverables = [] }) =>
      !(
        isDefined(serviceKey) &&
        [
          'pre_production_review_round',
          'post_production_review_round',
        ].includes(serviceKey)
      ) && deliverables.length === 0
  ).length

  const deliverables = projectServices.flatMap(
    ({ deliverables = [] }) => deliverables
  ).length

  const { preProductionReviewRounds = 0, postProductionReviewRounds = 0 } =
    project

  return (
    <List>
      {services > 0 && (
        <List.Item>
          {t('services', { count: services })}
          {preProductionReviewRounds > 0 &&
            t('pre_production_review_rounds', {
              count: preProductionReviewRounds,
            })}
        </List.Item>
      )}
      {deliverables > 0 && (
        <List.Item>
          {t('deliverables', { count: deliverables })}
          {postProductionReviewRounds > 0 &&
            t('post_production_review_rounds', {
              count: postProductionReviewRounds,
            })}
        </List.Item>
      )}
    </List>
  )
}
