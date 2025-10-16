import { useMemo } from 'react'
import { type CellContext, createColumnHelper } from '@tanstack/react-table'

import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import type { ListBidOutput } from '@mntn-dev/bid-service/client'
import type { FileId } from '@mntn-dev/domain-types'
import type { PriceContextWithField } from '@mntn-dev/finance'
import { useTranslation } from '@mntn-dev/i18n'
import { Avatar, Button } from '@mntn-dev/ui-components'

import { useBidPricing } from '#utils/pricing/use-bid-pricing.ts'
import { getFileImageProxyUrl } from '~/utils/client/file-utilities.ts'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'

import { ProjectBidStatusTag } from '../components/project-bid-status-tag.tsx'

export const columnHelper = createColumnHelper<ListBidOutput>()

export type ProjectBidsTableColumnsProps = {
  hideBrandBidAmount: boolean
  onReviewBid: (bid: ListBidOutput) => void
}

const AmountCell = ({
  bid,
  context: { context },
}: {
  bid: ListBidOutput
  context: PriceContextWithField
}) => {
  /**
   * Displaying credit amounts in the table is not supported yet.
   * The amount columns are only rendered for non-credit projects.
   */
  const showCredits = false
  const { getFormattedPrice } = usePricingUtilities()

  const { creditCosts } = useBidPricing(
    bid,
    bid.project,
    bid.project.package.packageSource
  )

  return getFormattedPrice(
    context,
    showCredits,
    creditCosts,
    bid.project.package.packageSource
  )
}

export const useProjectBidsTableColumnDefs = ({
  hideBrandBidAmount,
  onReviewBid,
}: ProjectBidsTableColumnsProps) => {
  const { t } = useTranslation('project-bids-table')

  const { getPriceContextWithFields } = usePricingUtilities()

  return useMemo(() => {
    const priceContexts = hideBrandBidAmount
      ? getPriceContextWithFields().filter((ctx) => ctx.context !== 'brand')
      : getPriceContextWithFields()

    return [
      columnHelper.accessor('agencyTeam.avatarFileId', {
        id: 'agencyAvatar',
        cell: (props: CellContext<ListBidOutput, FileId>) => {
          const fileId = props.getValue()
          const url = fileId
            ? getFileImageProxyUrl({
                fileId: props.getValue(),
                options: {
                  width: 48,
                  height: 48,
                  gravity: 'custom',
                  crop: 'thumb',
                },
              })
            : undefined

          return (
            <Avatar size="med">
              <Avatar.Entity
                entity={{
                  avatarUrl: url,
                  displayName: props.row.original.agencyTeam.name,
                  initials: props.row.original.agencyTeam.name.slice(0, 1),
                }}
                image={NextImage({ unoptimized: true })}
              />
            </Avatar>
          )
        },
        header: '',
        enableSorting: false,
        meta: { sizeStrategy: { type: 'min' } },
      }),

      columnHelper.accessor('agencyTeam.name', {
        id: 'agencyName',
        header: t('headers.name'),
        enableSorting: true,
        meta: {
          dataTestId: 'agency-name',
          dataTrackingId: 'agency-name',
          sizeStrategy: { type: 'max' },
          primary: true,
        },
      }),

      ...priceContexts.map((context) =>
        columnHelper.accessor(context.bidPriceField, {
          id: context.bidPriceField,
          header:
            priceContexts.length > 1
              ? t(`headers.bid-${context.context}`)
              : t('headers.bid'),
          enableSorting: true,
          sortingFn: 'basic',
          cell: ({ row }) => (
            <AmountCell bid={row.original} context={context} />
          ),
          meta: {
            dataTestId: context.bidPriceField,
            dataTrackingId: context.bidPriceField,
          },
        })
      ),

      columnHelper.accessor('status', {
        id: 'status',
        header: t('headers.status'),
        enableSorting: true,
        cell: ({ getValue, row }) => {
          return (
            <ProjectBidStatusTag
              bidStatus={getValue()}
              projectStatus={row.original.project.status}
            />
          )
        },
      }),

      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          const canAcceptBid = row.original.acl.canAcceptBid
          const buttonText = canAcceptBid ? t('review-bid') : t('view-bid')

          return (
            <Button
              variant={canAcceptBid ? 'primary' : 'secondary'}
              size="sm"
              iconLeft="eye"
              onClick={() => onReviewBid(row.original)}
            >
              {buttonText}
            </Button>
          )
        },
      }),
    ]
  }, [t, hideBrandBidAmount, onReviewBid, getPriceContextWithFields])
}
