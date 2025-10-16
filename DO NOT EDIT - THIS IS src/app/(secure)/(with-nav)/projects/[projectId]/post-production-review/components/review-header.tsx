import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { Button, PageHeader } from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { ReviewActionCounter } from '#projects/[projectId]/post-production-review/components/review-action-counter.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import {
  areAllFinalAssetsUploaded,
  canUploadInitialFinalAssets,
  getBreadCrumbText,
  getSubHeadingText,
  isLeavingFeedback,
  isLeavingProposal,
  isWaitingForFeedback,
  isWaitingForProposal,
} from '#utils/project/review-helpers.ts'

export const ReviewHeader = () => {
  const {
    deliverables,
    form: {
      formState: { errors },
    },
    projectId,
    project,
    refetchReview,
    refetchProject,
    review,
    setProjectProcessingFinalFiles,
    showToast,
    submitFeedback,
    submitProposal,
    t,
  } = usePostProductionReviewContext()
  const router = useRouter()

  const handleGoBack = async () => {
    await refetchReview()
    await refetchProject({ projectId: review.project.projectId })

    router.backOrPush(
      route('/projects/:projectId').params({
        projectId: review.project.projectId,
      })
    )
  }

  const handleSubmitFeedback = async () => {
    if (review.acl.canSubmitFeedback) {
      await submitFeedback.mutateAsync({ projectId })
      await refetchReview()

      showToast.info({
        title: t('toast:deliverable.changes-requested.title'),
        body: t('toast:deliverable.changes-requested.body'),
        dataTestId: 'deliverable-changes-requested-info-toast',
        dataTrackingId: 'deliverable-changes-requested-info-toast',
      })

      await handleGoBack()
    }
  }

  const handleSubmitFinalAssets = async () => {
    if (project.acl.canAttachFinalAssetToDeliverable) {
      const completedProject = await setProjectProcessingFinalFiles.mutateAsync(
        {
          projectId: project.projectId,
        }
      )

      showToast.success({
        title: t('toast:deliverable.final-assets-submitted.title'),
        body: t('toast:deliverable.final-assets-submitted.body'),
        dataTestId: 'deliverable-final-assets-submitted-success-toast',
        dataTrackingId: 'deliverable-final-assets-submitted-success-toast',
      })

      await refetchProject(completedProject)

      await handleGoBack()
    }
  }

  const handleSubmitProposal = async () => {
    if (review.acl.canSubmitProposal) {
      await submitProposal.mutateAsync({
        projectId,
      })
      await refetchReview()

      showToast.info({
        title: t('toast:deliverable.proposal-submitted.title'),
        body: t('toast:deliverable.proposal-submitted.body'),
        dataTestId: 'deliverable-proposal-submitted-info-toast',
        dataTrackingId: 'deliverable-proposal-submitted-info-toast',
      })

      await handleGoBack()
    }
  }

  return (
    <PageHeader
      dataTestId="review-page-header"
      dataTrackingId="review-page-header"
    >
      <PageHeader.Main>
        <PageHeader.Overline>
          <PageHeader.OverlineLink onClick={handleGoBack}>
            {t('back', { ns: 'generic' })}
          </PageHeader.OverlineLink>
        </PageHeader.Overline>
        <PageHeader.TitleBreadcrumbs
          crumbs={[
            t('post-production-review:deliverables'),
            getBreadCrumbText(t, review, project.status),
          ]}
        />
        <PageHeader.Subtitle
          subtitle={getSubHeadingText(review, project, t)}
          textColor={
            isWaitingForProposal(review) || isWaitingForFeedback(review)
              ? 'notice'
              : 'info'
          }
        />
      </PageHeader.Main>
      <PageHeader.Controls>
        <ReviewActionCounter />
        {isLeavingProposal(review) && (
          <Button
            iconRight="arrow-right"
            onClick={handleSubmitProposal}
            disabled={!review.acl.canSubmitProposal}
            loading={submitProposal.isPending}
            dataTestId={`review-${review.reviewId}-submit-all-button`}
            dataTrackingId={`review-${review.reviewId}-submit-all-button`}
          >
            {t('post-production-review:submit-all')}
          </Button>
        )}
        {isLeavingFeedback(review) && (
          <Button
            iconRight="arrow-right"
            onClick={handleSubmitFeedback}
            disabled={
              !review.acl.canSubmitFeedback ||
              submitFeedback.isPending ||
              isNonEmptyArray(Object.keys(errors))
            }
            loading={submitFeedback.isPending}
            dataTestId={`review-${review.reviewId}-request-changes-button`}
            dataTrackingId={`review-${review.reviewId}-request-changes-button`}
          >
            {t('post-production-review:submit-feedback')}
          </Button>
        )}
        {canUploadInitialFinalAssets(project, review) && (
          <Button
            iconRight="arrow-right"
            onClick={handleSubmitFinalAssets}
            disabled={!areAllFinalAssetsUploaded(deliverables)}
            loading={setProjectProcessingFinalFiles.isPending}
            dataTestId={`review-${review.reviewId}-submit-final-deliverables-button`}
            dataTrackingId={`review-${review.reviewId}-submit-final-deliverables-button`}
          >
            {t('post-production-review:submit-final-deliverables')}
          </Button>
        )}
      </PageHeader.Controls>
    </PageHeader>
  )
}
