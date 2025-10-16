import { useCallback, useMemo } from 'react'

import { isCreditProgramKind } from '@mntn-dev/domain-types'
import type {
  PriceContext,
  ProjectLikeWithPricingFields,
} from '@mntn-dev/finance'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { isProjectStatusPostAward } from '../project/is-project-post-award.ts'
import { usePricingUtilities } from './use-pricing-utilities.ts'

export const useProjectPricing = (project: ProjectLikeWithPricingFields) => {
  const { hasPermission } = usePermissions()

  const canViewMakerPricing = hasPermission('cost:view')
  const canViewBrandPricing = hasPermission('cost-plus-margin:view')
  const acceptedBid = project.bids?.find((b) => b.status === 'accepted')
  const useBreakdown =
    isCreditProgramKind(project.chosenBillingMethod) || !!acceptedBid

  const { data: projectBreakdownBrand, isLoading: brandLoading } =
    trpcReactClient.finance.getProjectFinanceBreakdown.useQuery(
      {
        projectId: project.projectId,
        chargeKind: 'final',
        bidId: acceptedBid?.bidId,
        withMargin: true,
      },
      {
        enabled: canViewBrandPricing && useBreakdown,
      }
    )

  const { data: projectBreakdownMaker, isLoading: makerLoading } =
    trpcReactClient.finance.getProjectFinanceBreakdown.useQuery(
      {
        projectId: project.projectId,
        chargeKind: 'final',
        bidId: acceptedBid?.bidId,
        withMargin: false,
      },
      {
        enabled: canViewMakerPricing && useBreakdown,
      }
    )

  const { data: projectPriceBrand, isLoading: brandPriceLoading } =
    trpcReactClient.finance.getPackageCostsPlusAddons.useQuery(
      {
        projectId: project.projectId,
        withMargin: true,
      },
      {
        enabled: canViewBrandPricing && !useBreakdown,
      }
    )

  const { data: projectPriceMaker, isLoading: makerPriceLoading } =
    trpcReactClient.finance.getPackageCostsPlusAddons.useQuery(
      {
        projectId: project.projectId,
        withMargin: false,
      },
      {
        enabled: canViewMakerPricing && !useBreakdown,
      }
    )

  const projectCost = useMemo(
    () =>
      projectBreakdownMaker?.bid ??
      projectBreakdownMaker?.price.total.dollars ??
      projectPriceMaker?.total,
    [projectBreakdownMaker, projectPriceMaker]
  )

  const projectCostPlusMarginDollars = useMemo(
    () =>
      projectBreakdownBrand
        ? Number(projectBreakdownBrand.cost.total.dollars)
        : projectPriceBrand?.total,
    [projectBreakdownBrand, projectPriceBrand]
  )

  const projectCostPlusMarginCredits = useMemo(
    () =>
      projectBreakdownBrand
        ? Number(projectBreakdownBrand.cost.total.credits)
        : undefined,
    [projectBreakdownBrand]
  )

  const projectBaseCost = useMemo(
    () => projectBreakdownMaker?.cost.package.dollars,
    [projectBreakdownMaker]
  )

  const projectBaseDollars = useMemo(
    () =>
      projectBreakdownBrand?.creditUnits
        ? projectBreakdownBrand?.cost.package.credits
        : projectBreakdownBrand?.cost.package.dollars,
    [projectBreakdownBrand]
  )

  const showCredits = useMemo(() => {
    // show credits for mntn credit users or for internal users on any credit program
    return (
      projectBreakdownBrand?.creditUnits === 'mntn_credits' ||
      (!!projectBreakdownBrand?.creditUnits &&
        hasPermission('project:administer'))
    )
  }, [projectBreakdownBrand, hasPermission])

  const {
    getPriceContexts,
    getPriceLabel,
    getPriceValue,
    getFormattedPrice,
    getCurrencyLabel,
  } = usePricingUtilities()

  const getProjectCurrencyLabel = useCallback(
    (context: PriceContext) => {
      return getCurrencyLabel(
        context,
        showCredits,
        project.package?.packageSource
      )
    },
    [getCurrencyLabel, showCredits, project]
  )

  const getProjectCurrency = useCallback(
    (context: PriceContext, projectLike: ProjectLikeWithPricingFields) => {
      const dollars =
        (projectCost && context === 'agency') ||
        (projectCostPlusMarginDollars && context === 'brand')
          ? getFormattedPrice(
              context,
              false,
              {
                cost: projectCost,
                costPlusMargin: projectCostPlusMarginDollars,
              },
              projectLike.package?.packageSource
            )
          : ''

      const credits =
        showCredits && projectCostPlusMarginCredits && context === 'brand'
          ? getFormattedPrice(
              context,
              true,
              {
                costPlusMargin: projectCostPlusMarginCredits,
              },
              projectLike.package?.packageSource
            )
          : ''

      return {
        credits,
        dollars,
      }
    },
    [
      getFormattedPrice,
      projectCost,
      projectCostPlusMarginDollars,
      projectCostPlusMarginCredits,
      showCredits,
    ]
  )

  const getProjectPriceLabel = useCallback(
    (context: PriceContext, variant: 'price' | 'total-price') =>
      getPriceLabel(
        context,
        variant,
        isProjectStatusPostAward(project.status),
        isCreditProgramKind(project.chosenBillingMethod)
      ),
    [getPriceLabel, project]
  )

  return {
    loading:
      brandLoading || makerLoading || brandPriceLoading || makerPriceLoading,
    creditCosts: {
      cost: projectCost,
      costPlusMargin: projectCostPlusMarginDollars,
      costPlusMarginCredits: projectCostPlusMarginCredits,
    },
    creditCostsBase: {
      cost: projectBaseCost,
      costPlusMargin: projectBaseDollars,
    },
    creditProgramKind: projectBreakdownBrand
      ? projectBreakdownBrand.creditUnits
      : undefined,
    getPriceContexts,
    getProjectPriceLabel,
    getPriceValue,
    getProjectCurrency,
    getProjectCurrencyLabel,
    showCredits,
    projectPriceBrand,
    projectPriceMaker,
    projectBreakdownBrand,
    projectBreakdownMaker,
  }
}
