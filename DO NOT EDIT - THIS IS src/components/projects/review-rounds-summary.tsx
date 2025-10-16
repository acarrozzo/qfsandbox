import {
  type ProjectDomainQueryModel,
  type ProjectServiceDomainQueryModel,
  servicesWithDeliverables,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Stack, Text, WhiteSpace } from '@mntn-dev/ui-components'

type Props = {
  project: ProjectDomainQueryModel
  services: ProjectServiceDomainQueryModel[]
}

export const ReviewRoundsSummary = ({ project, services }: Props) => {
  const { t } = useTranslation('project-details')
  const deliverableServices = servicesWithDeliverables(services)

  return (
    <Stack alignItems="end" direction="col">
      <Text fontSize="base" textColor="secondary">
        {t('review-rounds-summary.pre-production', {
          count: services.length,
        })}
        <WhiteSpace />
        /<WhiteSpace />
        {t('review-rounds-summary.rounds-each', {
          count: project.preProductionReviewRounds ?? 0,
        })}
      </Text>

      <Text fontSize="base" textColor="secondary">
        {t('review-rounds-summary.deliverables', {
          count: deliverableServices.length,
        })}
        <WhiteSpace />
        /<WhiteSpace />
        {t('review-rounds-summary.rounds-total', {
          count: project.postProductionReviewRounds ?? 0,
        })}
      </Text>
    </Stack>
  )
}
