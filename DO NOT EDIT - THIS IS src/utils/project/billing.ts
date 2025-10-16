import {
  BillingMethodPriority,
  isCreditProgramKind,
  type ProjectDomainQueryModel,
} from '@mntn-dev/domain-types'
import type { GetProjectFinanceBreakdownOutput } from '@mntn-dev/finance-service/types'

export type SetupBillingType =
  | 'payment-method'
  | 'billing-info'
  | 'insufficient-funds'

export const getFallbackBillingMethod = (project: ProjectDomainQueryModel) =>
  [...project.billingMethods]
    .filter((method) => method in BillingMethodPriority)
    .sort((a, b) => BillingMethodPriority[a] - BillingMethodPriority[b])[1] ??
  null

export const getFallbackFinanceBreakdownData = () => ({
  available: {
    creditCard: false,
    invoice: false,
  },
  canPay: {
    invoice: false,
    dollars: false,
    credits: false,
  },
  charges: {
    current: {
      total: { dollars: 0, credits: 0 },
    },
  },
  creditUnits: undefined,
})

export const shouldChargeToInvoice = (
  project: ProjectDomainQueryModel,
  projectFinanceBreakdown?: GetProjectFinanceBreakdownOutput
) => {
  const billingMethodIsCreditProgram = isCreditProgramKind(
    project.chosenBillingMethod
  )
  const fallbackBillingMethod = getFallbackBillingMethod(project)
  const fallbackFinanceBreakdown = getFallbackFinanceBreakdownData()

  const invoiceAvailable =
    projectFinanceBreakdown?.available.invoice ??
    fallbackFinanceBreakdown.available.invoice
  const totalDollars =
    projectFinanceBreakdown?.charges.current.total.dollars ??
    fallbackFinanceBreakdown.charges.current.total.dollars

  return (
    (project.chosenBillingMethod === 'invoice' ||
      (billingMethodIsCreditProgram && fallbackBillingMethod === 'invoice')) &&
    invoiceAvailable &&
    totalDollars > 0
  )
}

export const shouldChargeToCard = (
  project: ProjectDomainQueryModel,
  projectFinanceBreakdown?: GetProjectFinanceBreakdownOutput
) => {
  const billingMethodIsCreditProgram = isCreditProgramKind(
    project.chosenBillingMethod
  )
  const fallbackBillingMethod = getFallbackBillingMethod(project)
  const fallbackFinanceBreakdown = getFallbackFinanceBreakdownData()

  const creditCardAvailable =
    projectFinanceBreakdown?.available.creditCard ??
    fallbackFinanceBreakdown.available.creditCard
  const totalDollars =
    projectFinanceBreakdown?.charges.current.total.dollars ??
    fallbackFinanceBreakdown.charges.current.total.dollars

  return (
    (project.chosenBillingMethod === 'stripe' ||
      (billingMethodIsCreditProgram && fallbackBillingMethod === 'stripe')) &&
    creditCardAvailable &&
    totalDollars > 0
  )
}

export const shouldChargeToCredits = (
  project: ProjectDomainQueryModel,
  projectFinanceBreakdown?: GetProjectFinanceBreakdownOutput
) => {
  const billingMethodIsCreditProgram = isCreditProgramKind(
    project.chosenBillingMethod
  )
  const fallbackFinanceBreakdown = getFallbackFinanceBreakdownData()
  const canPayCredits =
    projectFinanceBreakdown?.canPay.credits ??
    fallbackFinanceBreakdown.canPay.credits
  const totalCredits =
    projectFinanceBreakdown?.charges.current.total.credits ??
    fallbackFinanceBreakdown.charges.current.total.credits

  return billingMethodIsCreditProgram && canPayCredits && totalCredits > 0
}

export const getProjectCreditCharge = (
  project: ProjectDomainQueryModel,
  projectFinanceBreakdown?: GetProjectFinanceBreakdownOutput
) => {
  const fallbackFinanceBreakdown = getFallbackFinanceBreakdownData()
  const billingMethodIsCreditProgram = isCreditProgramKind(
    project.chosenBillingMethod
  )
  const canPayCredits =
    projectFinanceBreakdown?.canPay.credits ??
    fallbackFinanceBreakdown.canPay.credits
  const totalCredits =
    projectFinanceBreakdown?.charges.current.total.credits ??
    fallbackFinanceBreakdown.charges.current.total.credits

  if (billingMethodIsCreditProgram && canPayCredits) {
    return totalCredits
  }

  return 0
}

export const getProjectCardCharge = (
  project: ProjectDomainQueryModel,
  projectFinanceBreakdown?: GetProjectFinanceBreakdownOutput
) => {
  const fallbackFinanceBreakdown = getFallbackFinanceBreakdownData()
  const fallbackBillingMethod = getFallbackBillingMethod(project)

  const billingMethodIsCreditProgram = isCreditProgramKind(
    project.chosenBillingMethod
  )
  const creditCardAvailable =
    projectFinanceBreakdown?.available.creditCard ??
    fallbackFinanceBreakdown.available.creditCard
  const totalDollars =
    projectFinanceBreakdown?.charges.current.total.dollars ??
    fallbackFinanceBreakdown.charges.current.total.dollars
  const billingMethodIsCard =
    project.chosenBillingMethod === 'stripe' ||
    (billingMethodIsCreditProgram && fallbackBillingMethod === 'stripe')

  if (billingMethodIsCard && creditCardAvailable) {
    return totalDollars
  }

  return 0
}

export const getProjectInvoiceCharge = (
  project: ProjectDomainQueryModel,
  projectFinanceBreakdown?: GetProjectFinanceBreakdownOutput
) => {
  const fallbackFinanceBreakdown = getFallbackFinanceBreakdownData()
  const fallbackBillingMethod = getFallbackBillingMethod(project)

  const billingMethodIsCreditProgram = isCreditProgramKind(
    project.chosenBillingMethod
  )

  const invoiceAvailable =
    projectFinanceBreakdown?.available.invoice ??
    fallbackFinanceBreakdown.available.invoice
  const totalDollars =
    projectFinanceBreakdown?.charges.current.total.dollars ??
    fallbackFinanceBreakdown.charges.current.total.dollars
  const billingMethodIsInvoice =
    project.chosenBillingMethod === 'invoice' ||
    (billingMethodIsCreditProgram && fallbackBillingMethod === 'invoice')

  if (billingMethodIsInvoice && invoiceAvailable) {
    return totalDollars
  }

  return 0
}

export const checkForBillingSetupNeeded = (
  project: ProjectDomainQueryModel,
  projectFinanceBreakdown?: GetProjectFinanceBreakdownOutput
) => {
  const fallbackFinanceBreakdown = getFallbackFinanceBreakdownData()

  const canPayCredits =
    projectFinanceBreakdown?.canPay.credits ??
    fallbackFinanceBreakdown.canPay.credits
  const canPayDollars =
    projectFinanceBreakdown?.canPay.dollars ??
    fallbackFinanceBreakdown.canPay.dollars

  const billingMethodIsCreditProgram = isCreditProgramKind(
    project.chosenBillingMethod
  )

  if (projectFinanceBreakdown?.missingBillingInfo) {
    return 'billing-info'
  }

  if (billingMethodIsCreditProgram && !canPayCredits) {
    return 'insufficient-funds'
  }

  if (shouldChargeToCard(project, projectFinanceBreakdown) && !canPayDollars) {
    return 'payment-method'
  }

  return null
}
