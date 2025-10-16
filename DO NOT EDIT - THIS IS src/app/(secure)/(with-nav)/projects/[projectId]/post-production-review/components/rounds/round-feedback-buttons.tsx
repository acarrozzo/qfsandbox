import { Controller } from '@mntn-dev/forms'
import { RadioGroup } from '@mntn-dev/ui-components'

import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { noMoreFeedbackRounds } from '#utils/project/rounds-helpers.ts'

export const RoundFeedbackButtons = () => {
  const {
    form: { control },
    review,
    submitForm,
    t,
  } = usePostProductionReviewContext()

  return (
    <Controller
      control={control}
      name="status"
      render={({ field }) => {
        return (
          <RadioGroup
            dataTestId={`review-${review.reviewId}-feedback-buttons`}
            dataTrackingId="current-round-active-comment-container"
            {...field}
            value={field.value ?? null}
            onChange={(e) => {
              field.onChange(e)
              submitForm()
            }}
          >
            <RadioGroup.Button
              value="approved"
              theme="positive"
              dataTestId="review-feedback-button-approved"
              dataTrackingId="review-feedback-button-approved"
            >
              {t('post-production-review:approve')}
            </RadioGroup.Button>

            <RadioGroup.Button
              value="changes_requested"
              theme="notice"
              disabled={noMoreFeedbackRounds(review)}
              dataTestId="review-feedback-button-changes-requested"
              dataTrackingId="review-feedback-button-changes-requested"
            >
              {t('post-production-review:request-changes')}
            </RadioGroup.Button>
          </RadioGroup>
        )
      }}
    />
  )
}
