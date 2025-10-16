'use client'

import { Form } from '@mntn-dev/ui-components'

import { BrandNote } from '#components/services/service-details/main-tabs/details/brand-note.tsx'

import { ServiceDetailsAside } from './service-details-aside.tsx'
import { ServiceDetailsHeader } from './service-details-header.tsx'
import {
  ServiceDetailsProvider,
  type UseServiceDetailsProps,
  useServiceDetails,
} from './use-service-details.ts'

type ServiceDetailsProps = UseServiceDetailsProps

const ServiceDetails = (props: ServiceDetailsProps) => {
  const context = useServiceDetails(props)

  const {
    form: { handleSubmit },
    formId,
    onValidFormSubmit,
    projectServiceId,
    setFormRef,
  } = context

  return (
    <ServiceDetailsProvider value={context}>
      <Form
        id={formId}
        ref={setFormRef}
        dataTestId={`service-note-form-${projectServiceId}`}
        dataTrackingId={`service-note-form-${projectServiceId}`}
        onSubmit={handleSubmit(onValidFormSubmit)}
        className="gap-0"
      >
        <ServiceDetailsHeader />
        <div className="flex-1 flex min-h-[80vh] max-h-[80vh] gap-x-4 w-full">
          <div className="flex flex-col gap-y-4 w-7/12">
            <BrandNote />
          </div>
          <div className="flex flex-col gap-y-4 w-5/12">
            <ServiceDetailsAside />
          </div>
        </div>
      </Form>
    </ServiceDetailsProvider>
  )
}

export { ServiceDetails }
