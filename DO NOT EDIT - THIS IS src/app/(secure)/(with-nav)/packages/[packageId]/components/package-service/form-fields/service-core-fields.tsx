import { ServiceCostField } from './service-cost-field.tsx'
import { ServiceCountField } from './service-count-field.tsx'
import { ServiceTypeField } from './service-type-field.tsx'
import type { ServiceFieldProps } from './types.ts'

export const ServiceCoreFields = (props: ServiceFieldProps) => (
  <>
    <ServiceTypeField {...props} />
    <ServiceCostField {...props} />
    <ServiceCountField {...props} />
  </>
)
