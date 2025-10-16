import { projectTagCategories } from '@mntn-dev/app-common'
import { route } from '@mntn-dev/app-routing'
import { FormattedDate } from '@mntn-dev/app-ui-components'
import {
  CompletedProjectStatuses,
  toTagsByCategoryMap,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import {
  DataList,
  Grid,
  IconButton,
  LoadingSpinner,
  Stack,
  Surface,
  Tooltip,
  WhiteSpace,
} from '@mntn-dev/ui-components'

import { ProjectTransferModal } from '~/app/(secure)/(with-nav)/projects/components/project-transfer-modal.tsx'
import { useProjectTransfer } from '~/app/(secure)/(with-nav)/projects/hooks/use-project-transfer.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'
import { useProjectPricing } from '~/utils/pricing/use-project-pricing.ts'
import { isProjectPostAward } from '~/utils/project/is-project-post-award.ts'

import { ProjectFileManagerLauncher } from '../files/project-file-manager-launcher.tsx'
import { NextLink } from '../link/next-link.tsx'
import { TagListCategory } from '../tag-list/tag-list-category.tsx'

export const ProjectInfoBox = ({
  project,
  projectServices,
  showViewFiles,
}: {
  project: ProjectWithAcl
  projectServices: ProjectServiceWithAcl[]
  showViewFiles?: boolean
}) => {
  const { t } = useTranslation(['generic', 'project-details'])

  const { hasPermission } = usePermissions()

  const {
    loading,
    getPriceContexts,
    getProjectPriceLabel,
    getProjectCurrency,
  } = useProjectPricing(project)

  const { dueDate, biddingCloseDate, projectId, status } = project

  // only show tooltip when brand name is longer than "normal"
  const showBrandNameTooltip =
    hasPermission('agency:view') && project.brandCompanyName.length > 15

  const prices = getPriceContexts()

  const tagsByCategory = toTagsByCategoryMap(project.tags)

  const customServiceCount =
    projectServices?.filter((s) => s.serviceType === 'custom').length ?? 0

  const priceColumnSpan =
    isProjectPostAward(project) && prices.length === 1 ? 2 : 1

  const awardedBid = project.bids?.find((bid) => bid.status === 'accepted')

  const {
    handleTransferProject,
    projectTransferModalOpenState,
    isProjectTransferring,
    isProjectTransferError,
  } = useProjectTransfer()

  return (
    <Surface width="full" minHeight="80" padding="6" border elevation="xs">
      <DataList
        fontSize="sm"
        rowGap="8"
        columnGap="3"
        columnCount={2}
        className="w-full"
      >
        <DataList.Item>
          <DataList.Title>{t('project-details:brand')}</DataList.Title>
          <Tooltip content={showBrandNameTooltip && project.brandCompanyName}>
            <span>
              <Stack direction="col">
                <DataList.Description singleLine>
                  <div className="inline-flex max-w-full overflow-hidden items-center gap-0.5">
                    <div className="flex-auto truncate">
                      {project.brandCompanyName}
                    </div>
                    {hasPermission('project:administer') &&
                      !CompletedProjectStatuses.includes(project.status) && (
                        <div className="flex-none">
                          <WhiteSpace />
                          <IconButton
                            size="sm"
                            name="pencil"
                            className="inline"
                            onClick={projectTransferModalOpenState.onOpen}
                          />
                          <ProjectTransferModal
                            key={`transfer-modal-${projectTransferModalOpenState.open ? 'open' : 'closed'}`}
                            project={project}
                            {...projectTransferModalOpenState}
                            onTransferProject={handleTransferProject}
                            isProjectTransferring={isProjectTransferring}
                            isProjectTransferError={isProjectTransferError}
                          />
                        </div>
                      )}
                  </div>
                </DataList.Description>
              </Stack>
            </span>
          </Tooltip>
        </DataList.Item>

        {awardedBid ? (
          <DataList.Item>
            <DataList.Title>
              {t('maker', { ns: 'project-details' })}
            </DataList.Title>
            <DataList.Description className="flex gap-1 items-baseline">
              {project.agencyTeam?.name}
              <NextLink
                href={route('/projects/:projectId/bid/:bidId')
                  .params({
                    projectId: project.projectId,
                    bidId: awardedBid.bidId,
                  })
                  .toRelativeUrl()}
                className="text-tertiary hover:underline"
              >
                {t('view-bid', { ns: 'project-details' })}
              </NextLink>
            </DataList.Description>
          </DataList.Item>
        ) : (
          hasPermission('project:administer') && <DataList.Item />
        )}

        {prices.map((priceContext) => {
          const { dollars, credits } = getProjectCurrency(priceContext, project)
          return (
            <DataList.Item key={priceContext} columnSpan={priceColumnSpan}>
              {(credits || dollars) && (
                <>
                  <DataList.Title>
                    {getProjectPriceLabel(priceContext, 'price')}
                  </DataList.Title>
                  <DataList.Description className="flex items-center gap-1">
                    {loading ? (
                      <LoadingSpinner className="text-brand h-6 w-6" />
                    ) : (
                      `${credits} ${credits && dollars && '+'} ${dollars}`
                    )}
                    {!isProjectPostAward(project) && customServiceCount > 0 && (
                      <span className="font-bold">
                        {t('project-details:minimum-bid-custom-services', {
                          count: customServiceCount,
                        })}
                      </span>
                    )}
                  </DataList.Description>
                </>
              )}
            </DataList.Item>
          )
        })}

        <DataList.Item>
          <DataList.Title>
            {t(
              status === 'bidding_open'
                ? 'bidding-close-date'
                : 'bidding-closed-date',
              { ns: 'project-details' }
            )}
          </DataList.Title>
          <DataList.Description>
            <FormattedDate
              date={biddingCloseDate}
              format="medium-date-alt-time"
              uppercase
            />
          </DataList.Description>
        </DataList.Item>

        <DataList.Item>
          <DataList.Title>
            {t('due-date', { ns: 'project-details' })}
          </DataList.Title>
          <DataList.Description>
            <FormattedDate date={dueDate} format="medium-date-alt" uppercase />
          </DataList.Description>
        </DataList.Item>

        {projectTagCategories.map((category) => (
          <TagListCategory
            key={category}
            category={category}
            label={t(`project-details:${category}.label`)}
            placeholder={t(`project-details:${category}.placeholder`)}
            showEmpty
            tags={tagsByCategory[category]}
            variant="rounded-square"
          />
        ))}

        {hasPermission('project:administer') && (
          <>
            <DataList.Item>
              <DataList.Title>
                {t('project-details:payment-option')}
              </DataList.Title>
              <DataList.Description>
                {t(
                  `project-details:billing_schedules.${project.billingSchedule}`
                )}
              </DataList.Description>
            </DataList.Item>
            <DataList.Item>
              <DataList.Title>
                {t('project-details:invoice-payment-terms')}
              </DataList.Title>
              <DataList.Description>
                {t(`project-details:payment_terms.${project.invoiceTerms}`)}
              </DataList.Description>
            </DataList.Item>
          </>
        )}

        {showViewFiles && (
          <Grid.Item>
            <ProjectFileManagerLauncher
              projectId={projectId}
              variant="view-files"
              className="w-full"
              dataTestId="project-details-file-manager-button"
              dataTrackingId="project-details-file-manager-button"
            />
          </Grid.Item>
        )}
      </DataList>
    </Surface>
  )
}
