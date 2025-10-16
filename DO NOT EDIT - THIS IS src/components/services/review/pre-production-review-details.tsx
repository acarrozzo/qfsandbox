'use client'

import { Form } from '@mntn-dev/ui-components'

import {
  PreProductionReviewProvider,
  type UsePreProductionReviewProps,
  usePreProductionReview,
} from '#components/services/review/use-pre-production-review.ts'

import { PreProductionReviewDetailsAside } from './pre-production-review-details-aside.tsx'
import { PreProductionReviewDetailsHeader } from './pre-production-review-details-header.tsx'
import { PreProductionReviewDetailsMain } from './pre-production-review-details-main.tsx'

type ServiceReviewProps = UsePreProductionReviewProps

const PreProductionReviewDetails = (props: ServiceReviewProps) => {
  const context = usePreProductionReview(props)

  const {
    form: { handleSubmit },
    formId,
    onValidFormSubmit,
    projectServiceId,
    setFormRef,
  } = context

  return (
    <PreProductionReviewProvider value={context}>
      <Form
        id={formId}
        ref={setFormRef}
        dataTestId={`service-review-form-${projectServiceId}`}
        dataTrackingId={`service-review-form-${projectServiceId}`}
        onSubmit={handleSubmit(onValidFormSubmit)}
        className="gap-0"
      >
        <PreProductionReviewDetailsHeader />
        {/* fix this systemically so we don't have to set the max-h here */}
        <div className="flex-1 flex gap-x-4 min-h-[80vh] max-h-[80vh] w-full">
          <div className="flex flex-col gap-y-4 w-7/12">
            <PreProductionReviewDetailsMain />
          </div>
          <div className="flex flex-col gap-y-4 w-5/12">
            <PreProductionReviewDetailsAside />
          </div>
        </div>
      </Form>
    </PreProductionReviewProvider>
  )
}

export { PreProductionReviewDetails }
