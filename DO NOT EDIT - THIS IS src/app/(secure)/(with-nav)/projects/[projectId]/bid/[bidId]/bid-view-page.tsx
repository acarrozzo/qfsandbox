'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { SelectBidOutput } from '@mntn-dev/bid-service/client'
import { isCreditProgramKind } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  DataList,
  Heading,
  PageHeader,
  RichText,
  SidebarLayoutContent,
  Stack,
} from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'

import { TeamAvatar } from '#components/avatar/team-avatar.tsx'
import { BidViewFooter } from '#projects/[projectId]/bid/[bidId]/bid-view-footer.tsx'
import { BidWithdrawConfirmationModal } from '#projects/[projectId]/bid/[bidId]/bid-withdraw-confirmation-modal.tsx'
import { RejectFinalBidConfirmationModal } from '#projects/[projectId]/bid/[bidId]/reject-final-bid-confirmation-modal.tsx'
import { BiddingPageAlert } from '#projects/[projectId]/bid/components/bidding-page-alert.tsx'
import { ExampleVideoList } from '#projects/[projectId]/bid/components/example-video-list.tsx'
import { BidProvider, useBid } from '#projects/[projectId]/bid/hooks/use-bid.ts'
import { shouldShowBidAmount } from '#utils/project/should-show-bid-amount.ts'
import { AcceptBidModal } from '~/app/(secure)/(with-nav)/projects/[projectId]/bid/[bidId]/accept-bid-modal/accept-bid-modal.tsx'
import { TwoColumn } from '~/components/layout/two-column/two-column.tsx'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'

import { AcceptBidSetupBillingModal } from './accept-bid-modal/accept-bid-setup-billing-modal.tsx'
import { MakerBidAcceptedByBrandSurveyModal } from './survey/bid-accepted-survey-modal.tsx'

type BidViewPageProps = {
  initialBid: SelectBidOutput
}

export const BidViewPage = ({ initialBid }: BidViewPageProps) => {
  const router = useRouter()
  const { t } = useTranslation(['bids'])

  const context = useBid({
    initialBid,
  })

  const { getPriceContextWithFields, getFormattedPrice } = usePricingUtilities()
  const priceContexts = getPriceContextWithFields()

  const {
    acceptBid,
    bid,
    creditCosts,
    creditProgramKind,
    chooseBidForm,
    getFixedProjectCostPlusMargin,
    handleAcceptBid,
    handleRejectBid,
    handleWithdrawBid,
    project,
    rejectBid,
    setShowConfirmModal,
    showConfirmModal,
    updateBid,
    showSurvey,
  } = context

  const isCreditProgramProject = isCreditProgramKind(
    project.chosenBillingMethod
  )

  const handleBack = () => {
    router.backOrPush(
      route('/projects/:projectId').params({ projectId: bid.projectId })
    )
  }

  const handleSurveyClose = () => router.push(route('/dashboard'))

  return (
    <BidProvider value={context}>
      <SidebarLayoutContent>
        <PageHeader
          dataTestId="project-bidding-view-page-header"
          dataTrackingId="project-bidding-view-page-header"
        >
          <PageHeader.Main>
            <PageHeader.Overline>
              <PageHeader.OverlineLink onClick={handleBack}>
                {t('bids:back')}
              </PageHeader.OverlineLink>
              <PageHeader.OverlineDivider />
              <PageHeader.OverlineBreadcrumbs
                crumbs={[bid.project.name, t('bids:review-bid')]}
              />
            </PageHeader.Overline>
            <PageHeader.Title title={t('bids:bid-offer')} />
          </PageHeader.Main>
          {bid.status === 'submitted' && bid.acl.canUpdateBid && (
            <PageHeader.Controls>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowConfirmModal('withdraw')}
                dataTestId="withdraw-bid-button"
                dataTrackingId="withdraw-bid-button"
              >
                {t('bids:withdraw-bid')}
              </Button>
            </PageHeader.Controls>
          )}
        </PageHeader>
        <TwoColumn>
          <TwoColumn.Main columnSpan={5}>
            <Stack direction="col" gap="6">
              <BiddingPageAlert bid={bid} />
              <Stack
                paddingX="4"
                paddingY="10"
                gap="6"
                className={`border-b ${themeBorderColorMap.muted}`}
              >
                <TeamAvatar
                  size="2xl"
                  team={bid.agencyTeam}
                  dataTestId="bidding-page-team-avatar"
                  dataTrackingId="bidding-page-team-avatar"
                />
                <Stack direction="col" gap="2">
                  <Heading
                    dataTestId="bidding-page-team-name"
                    dataTrackingId="bidding-page-team-name"
                  >
                    {bid.agencyTeam.name}
                  </Heading>
                  <RichText
                    bounded
                    dataTestId="bidding-page-team-bio"
                    dataTrackingId="bidding-page-team-bio"
                    value={bid.agencyTeam.profile?.overview}
                  />
                </Stack>
              </Stack>

              <DataList gap="6">
                {shouldShowBidAmount(project) &&
                  priceContexts.map(({ context }) => (
                    <DataList.Item
                      key={context}
                      dataTestId={`bid-amount-data-list-item-${context}`}
                    >
                      <DataList.Title>
                        {priceContexts.length > 1
                          ? t(`bids:bid-${context}`)
                          : t('bids:bid')}
                      </DataList.Title>
                      <DataList.Description>
                        {isCreditProgramProject && context === 'brand'
                          ? getFixedProjectCostPlusMargin()
                          : getFormattedPrice(
                              context,
                              !!creditProgramKind,
                              creditCosts,
                              project.package?.packageSource
                            )}
                      </DataList.Description>
                    </DataList.Item>
                  ))}

                <DataList.Item dataTestId="bid-pitch-data-list-item">
                  <DataList.Title>{t('bids:pitch')}</DataList.Title>
                  <DataList.Description>
                    <RichText bounded value={bid.pitch} />
                  </DataList.Description>
                </DataList.Item>
              </DataList>
            </Stack>
          </TwoColumn.Main>
          <TwoColumn.Aside columnSpan={6}>
            <ExampleVideoList />
          </TwoColumn.Aside>
        </TwoColumn>
      </SidebarLayoutContent>
      <BidViewFooter isCreditProgramProject={isCreditProgramProject} />

      <BidWithdrawConfirmationModal
        open={showConfirmModal === 'withdraw'}
        onClose={() => setShowConfirmModal(undefined)}
        onConfirm={handleWithdrawBid}
        confirmIsLoading={updateBid.isPending}
      />

      <RejectFinalBidConfirmationModal
        open={showConfirmModal === 'reject-final-bid'}
        onClose={() => setShowConfirmModal(undefined)}
        onConfirm={handleRejectBid}
        confirmIsLoading={rejectBid.isPending}
      />

      {project.chosenBillingMethod === 'none' ? (
        <AcceptBidSetupBillingModal
          open={showConfirmModal === 'accept-bid'}
          onClose={() => setShowConfirmModal(undefined)}
          setupType="payment-method"
        />
      ) : (
        <AcceptBidModal
          open={showConfirmModal === 'accept-bid'}
          onClose={() => setShowConfirmModal(undefined)}
          onConfirm={() => handleAcceptBid(chooseBidForm.getValues())}
          confirmIsLoading={acceptBid.isPending}
        />
      )}

      <MakerBidAcceptedByBrandSurveyModal
        open={showSurvey === 'maker-bid-accepted-by-brand'}
        bidId={bid.bidId}
        onClose={handleSurveyClose}
      />
    </BidProvider>
  )
}
