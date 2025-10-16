import {
  Form,
  FormField,
  Stack,
  Surface,
  Text,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'

import { RoundFeedbackButtons } from '#projects/[projectId]/post-production-review/components/rounds/round-feedback-buttons.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import {
  isLeavingFeedback,
  isLeavingProposal,
} from '#utils/project/review-helpers.ts'
import {
  isCommentRequired,
  noMoreFeedbackRounds,
} from '#utils/project/rounds-helpers.ts'

export const RoundCurrentComment = () => {
  const {
    form: {
      control,
      handleSubmit,
      formState: { errors },
    },
    formId,
    onValidFormSubmit,
    review,
    selectedDeliverable,
    setFormRef,
    submitForm,
    t,
  } = usePostProductionReviewContext()

  const {
    field: { value: noteValue, ...field },
  } = useEditorController({
    control,
    name: 'note',
  })

  const placeholderText = t('post-production-review:comments.placeholder', {
    optional:
      isLeavingFeedback(review) &&
      isCommentRequired(review, selectedDeliverable.deliverableId)
        ? ''
        : t('post-production-review:comments.optional'),
  })

  const getLabelText = () => {
    if (isLeavingProposal(review)) {
      return t('post-production-review:comments.comment')
    }

    if (isLeavingFeedback(review)) {
      return isCommentRequired(review, selectedDeliverable.deliverableId)
        ? t('post-production-review:comments.provide-requested-changes')
        : t('post-production-review:comments.provide-optional-comments')
    }
  }

  return (
    <Form
      id={formId}
      ref={setFormRef}
      dataTestId={`review-note-form-${review.reviewId}-${selectedDeliverable.deliverableId}}`}
      dataTrackingId={`review-note-form-${review.reviewId}-${selectedDeliverable.deliverableId}}`}
      onSubmit={handleSubmit(onValidFormSubmit)}
    >
      <Surface.Body className="overflow-y-auto">
        <Stack
          direction="col"
          gap="4"
          padding="8"
          justifyContent="start"
          alignItems="start"
          height="full"
          width="full"
          className="whitespace-pre-line overflow-auto"
          dataTestId="current-round-active-comment-container"
          dataTrackingId="current-round-active-comment-container"
        >
          {isLeavingFeedback(review) && <RoundFeedbackButtons />}

          {(isLeavingProposal(review) || !noMoreFeedbackRounds(review)) && (
            <Stack direction="col" width="full" gap="2">
              <Text textColor="secondary" fontSize="sm">
                {getLabelText()}
              </Text>
              <FormField hasError={!!errors.note}>
                <TextEditor
                  {...field}
                  defaultValue={noteValue}
                  placeholder={placeholderText}
                  className="w-full resize-none text-base font-normal h-64"
                  onBlur={submitForm}
                  dataTestId={`review-${review.reviewId}-comment-textarea`}
                  dataTrackingId={`review-${review.reviewId}-comment-textarea`}
                />
                <FormField.Error>{errors.note?.message}</FormField.Error>
              </FormField>
            </Stack>
          )}
        </Stack>
      </Surface.Body>
    </Form>
  )
}
