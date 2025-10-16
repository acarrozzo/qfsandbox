'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { SelectBidOutput } from '@mntn-dev/bid-service/client'
import { BidAmountMax, isCustomService } from '@mntn-dev/domain-types'
import { useController } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Form,
  FormField,
  Icon,
  Input,
  PageHeader,
  SidebarLayoutContent,
  SidebarLayoutFooter,
  Stack,
  Text,
  TextEditor,
} from '@mntn-dev/ui-components'
import { countItems } from '@mntn-dev/utilities'

import { ExampleVideoList } from '#projects/[projectId]/bid/components/example-video-list.tsx'
import { BidProvider, useBid } from '#projects/[projectId]/bid/hooks/use-bid.ts'
import { TwoColumn } from '~/components/layout/two-column/two-column.tsx'
import { MyOrganizationTeamSelect } from '~/components/team/team-select.tsx'
import { useMyOrganization } from '~/hooks/secure/use-my-organization.ts'
import { useDollarsField } from '~/utils/form/use-dollars-field.ts'

import { useBidViewRedirect } from '../../hooks/use-bid-view-redirect.ts'
import { BidAmountGuidance } from './bid-amount-guidance.tsx'
import { SubmitBidAgreements } from './submit-bid-agreements.tsx'

type BidEditPageProps = {
  initialBid: SelectBidOutput
}

export const BidEditPage = ({ initialBid }: BidEditPageProps) => {
  const { t } = useTranslation(['bids', 'generic'])
  const router = useRouter()
  const { multiTeam } = useMyOrganization()

  const context = useBid({
    initialBid,
  })

  const {
    bid,
    bidForm,
    services,
    discardBid,
    handleDiscardBid,
    handleSubmitBid,
    handleUpdateBid,
    project,
    submitBid,
    updateBid,
  } = context

  const customServiceCount = countItems(services ?? [], isCustomService)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = bidForm

  const { field: pitchField } = useController({
    control,
    name: 'pitch',
    rules: { required: true },
  })

  const handleBack = () => {
    router.backOrPush(
      route('/projects/:projectId').params({ projectId: bid.projectId })
    )
  }

  useBidViewRedirect(bid, !bid.acl.canUpdateBid)

  const max = project.bidCap ?? BidAmountMax

  const amountField = useDollarsField({
    field: t('bids:submit-bid-form.amount.label'),
    max,
  })

  return (
    <BidProvider value={context}>
      <SidebarLayoutContent>
        <PageHeader
          dataTestId="project-bidding-edit-page-header"
          dataTrackingId="project-bidding-edit-page-header"
        >
          <PageHeader.Main>
            <PageHeader.Overline>
              <PageHeader.OverlineLink onClick={handleBack}>
                {t('bids:back')}
              </PageHeader.OverlineLink>
              <PageHeader.OverlineDivider />
              <PageHeader.OverlineBreadcrumbs
                crumbs={[bid.project.name, t('bids:bid-on-project')]}
              />
            </PageHeader.Overline>
            <PageHeader.Title title={t('bids:project-bid')} />
          </PageHeader.Main>
        </PageHeader>
        <TwoColumn>
          <TwoColumn.Main columnSpan={5}>
            <Form
              dataTestId="bid-edit-form"
              dataTrackingId="bid-edit-form"
              id="bid-form"
              onSubmit={handleSubmit(handleSubmitBid)}
            >
              <Form.Layout columnCount={2} columnGap="6" rowGap="8">
                <FormField columnSpan={2} hasError={!!errors.amount}>
                  <FormField.Label>{t('bids:bid')}</FormField.Label>
                  <FormField.Control>
                    <Input
                      iconLeft={
                        <Icon name="money-dollar" size="md" color="brand" />
                      }
                      type="number"
                      min={0}
                      max={max}
                      dataTestId="bid-amount-input"
                      dataTrackingId="bid-amount-input"
                      {...register('amount', {
                        required: true,
                        valueAsNumber: true,
                        validate: amountField.validate,
                      })}
                      className="w-48"
                    />
                  </FormField.Control>
                  <FormField.Error>{errors.amount?.message}</FormField.Error>
                  <BidAmountGuidance
                    customServiceCount={customServiceCount}
                    isCapped={project.bidCap !== undefined}
                    value={project.bidCap ?? project.bidRecommendation}
                  />
                </FormField>

                {customServiceCount > 0 && (
                  <Stack gap="2" alignItems="center">
                    <Icon name="error-warning" size="2xl" color="notice" />
                    <Text fontSize="sm">
                      {t('bids:custom-services-disclaimer', {
                        count: customServiceCount,
                      })}
                    </Text>
                  </Stack>
                )}

                {multiTeam && (
                  <FormField columnSpan={2}>
                    <FormField.Label>{t('bids:bidding-team')}</FormField.Label>
                    <FormField.Control>
                      <MyOrganizationTeamSelect
                        onChange={() => {}}
                        value={bid.agencyTeamId}
                        disabled
                        dataTestId="bid-team-select"
                        dataTrackingId="bid-team-select"
                      />
                    </FormField.Control>
                  </FormField>
                )}

                <FormField columnSpan={2} hasError={!!errors.pitch}>
                  <FormField.Label>
                    {t('bids:submit-bid-form.pitch.label')}
                  </FormField.Label>
                  <FormField.Control>
                    <TextEditor
                      ref={pitchField.ref}
                      placeholder={t('bids:submit-bid-form.pitch.placeholder')}
                      className="h-[400px]"
                      dataTestId="bid-pitch-input"
                      dataTrackingId="bid-pitch-input"
                      onChange={pitchField.onChange}
                      onBlur={pitchField.onBlur}
                      defaultValue={pitchField.value}
                    />
                  </FormField.Control>
                  <FormField.Error>{errors.pitch?.message}</FormField.Error>
                </FormField>
              </Form.Layout>
            </Form>
          </TwoColumn.Main>
          <TwoColumn.Aside columnSpan={6}>
            <ExampleVideoList />
          </TwoColumn.Aside>
        </TwoColumn>
      </SidebarLayoutContent>
      <SidebarLayoutFooter>
        <Stack
          alignItems="center"
          justifyContent="between"
          width="full"
          gap="4"
        >
          <SubmitBidAgreements
            disabled={
              submitBid.isPending || discardBid.isPending || updateBid.isPending
            }
          />

          <Stack gap="4">
            <Button
              variant="secondary"
              onClick={handleDiscardBid}
              loading={discardBid.isPending}
              disabled={submitBid.isPending || updateBid.isPending}
              dataTestId="bid-discard-button"
              dataTrackingId="bid-discard-button"
            >
              {t('bids:discard-draft')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleUpdateBid(bidForm.getValues())}
              loading={updateBid.isPending}
              disabled={discardBid.isPending || submitBid.isPending}
              dataTestId="bid-save-as-draft-button"
              dataTrackingId="bid-save-as-draft-button"
            >
              {t('bids:save-as-draft')}
            </Button>
            <Button
              type="submit"
              form="bid-form"
              variant="primary"
              size="md"
              className="w-[320px]"
              loading={submitBid.isPending}
              disabled={discardBid.isPending || updateBid.isPending}
              dataTestId="bid-submit-button"
              dataTrackingId="bid-submit-button"
            >
              {t('bids:submit-bid-form.submit-button.label')}
            </Button>
          </Stack>
        </Stack>
      </SidebarLayoutFooter>
    </BidProvider>
  )
}
