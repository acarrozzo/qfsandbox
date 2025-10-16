import type { TFunction } from 'i18next'
import type { JSX } from 'react'

import type { Dollars, ProjectStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectServiceWithAcl } from '@mntn-dev/project-service'
import type { PreProductionSelectReviewOutput } from '@mntn-dev/review-service'
import { Blade, Stack, Tag } from '@mntn-dev/ui-components'
import { isDefined } from '@mntn-dev/utilities'

import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'

const getBiddingTag = ({ t }: { t: TFunction<'project-services'> }) => {
  return (
    <Tag type="info" variant="secondary">
      {t('read-note')}
    </Tag>
  )
}

const getDraftTag = ({
  t,
  hasBrandNote,
}: {
  t: TFunction<'project-services'>
  hasBrandNote: boolean
}) => {
  return (
    <Tag
      type={hasBrandNote ? 'success' : 'default'}
      variant="secondary"
      icon={hasBrandNote ? { name: 'check' } : undefined}
    >
      {hasBrandNote ? t('note-added') : t('add-note')}
    </Tag>
  )
}

const getConceptingTag = ({
  t,
  roundsUsed,
  canUpdateProposal,
}: {
  t: TFunction<'project-services'>
  roundsUsed: number
  canUpdateProposal: boolean
}) => {
  if (roundsUsed === 0) {
    if (canUpdateProposal) {
      return (
        <Tag type="error" variant="secondary">
          {t('ready-to-start')}
        </Tag>
      )
    }

    return <Tag variant="secondary">{t('not-started')}</Tag>
  }

  if (canUpdateProposal) {
    return (
      <Tag type="error" variant="secondary">
        {t('changes-requested')}
      </Tag>
    )
  }

  return (
    <Tag type="notice" variant="secondary">
      {t('changes-sent-to-maker')}
    </Tag>
  )
}

const getFeedbackTag = ({
  t,
  canApproveChanges,
}: {
  t: TFunction<'project-services'>
  canApproveChanges: boolean
}) => {
  if (canApproveChanges) {
    return (
      <Tag type="error" variant="secondary">
        {t('ready-to-review')}
      </Tag>
    )
  }

  return (
    <Tag type="notice" variant="secondary">
      {t('sent-for-review')}
    </Tag>
  )
}

const getResolvedTag = ({ t }: { t: TFunction<'project-services'> }) => {
  return (
    <Tag type="success" icon={{ name: 'check' }} variant="secondary">
      {t('completed')}
    </Tag>
  )
}

const getNoActionNeededTag = ({ t }: { t: TFunction<'project-services'> }) => {
  return (
    <Tag type="default" variant="secondary">
      {t('no-action-needed')}
    </Tag>
  )
}

const getServiceActionTags = ({
  t,
  service,
  projectStatus,
  review,
}: {
  t: TFunction<'project-services'>
  service: ProjectServiceWithAcl
  projectStatus: ProjectStatus
  price?: Dollars
  review?: PreProductionSelectReviewOutput
}) => {
  const { preProductionReview, brandNote, serviceType } = service

  const tags: JSX.Element[] = []

  const hasBrandNote = !!brandNote
  const needsBrandNote = preProductionReview || serviceType === 'custom'

  if (projectStatus === 'draft' && (hasBrandNote || needsBrandNote)) {
    tags.push(
      getDraftTag({
        t,
        hasBrandNote,
      })
    )
  }

  if (
    ['bidding_open', 'processing_bids', 'bidding_closed'].includes(
      projectStatus
    ) &&
    hasBrandNote
  ) {
    tags.push(getBiddingTag({ t }))
  }

  if (isDefined(review)) {
    switch (review?.status) {
      case 'concepting':
        tags.push(
          getConceptingTag({
            t,
            roundsUsed: review.currentRoundNumber - 1,
            canUpdateProposal: review.acl.canUpdateProposal,
          })
        )
        break
      case 'reviewing':
      case 'resolving':
        tags.push(
          getFeedbackTag({
            t,
            canApproveChanges: review.acl.canApproveChanges,
          })
        )
        break
      case 'resolved':
        tags.push(
          service.preProductionReview
            ? getResolvedTag({ t })
            : getNoActionNeededTag({ t })
        )
        break
      default: {
        break
      }
    }
  }

  return tags
}

export const ProjectServiceBladeTag = ({
  review,
  service,
  projectStatus,
}: {
  review?: PreProductionSelectReviewOutput
  service: ProjectServiceWithAcl
  projectStatus: ProjectStatus
}) => {
  const { t } = useTranslation('project-services')
  const { getPriceContexts, getPriceValue } = usePricingUtilities()
  const [priceContext] = getPriceContexts()
  const price = priceContext && getPriceValue(priceContext, service)
  const tags = getServiceActionTags({
    t,
    service,
    projectStatus,
    price,
    review,
  })

  return (
    <Stack gap="2">
      {tags.map((tag, index) => (
        <Blade.Tag key={`tag-${index + 1}`}>{tag}</Blade.Tag>
      ))}
    </Stack>
  )
}
