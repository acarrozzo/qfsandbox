import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { Alert, type AlertType, Text } from '@mntn-dev/ui-components'
import type { ThemeTextColor } from '@mntn-dev/ui-theme'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { getFullDateTimeString } from '#utils/date-helpers.ts'
import { getProjectClosedInfo } from '#utils/project/get-project-closed-info.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'

export const ProjectAlertBanner = ({
  project,
}: {
  project: ProjectWithAcl
}) => {
  const { principal } = usePrincipal()
  const { hasPermission } = usePermissions()
  const { t } = useTranslation(['project-alert-banner'])

  const { data: projectClosedActivity } =
    trpcReactClient.activity.getActivityByFeedId.useQuery({
      feedId: project.projectId,
      activityType: 'project_closed',
    })

  const getAlertText = () => {
    if (project.status === 'closed') {
      const projectClosedInfo = getProjectClosedInfo(projectClosedActivity?.[0])
      if (projectClosedInfo) {
        const { reason, name, timestamp } = projectClosedInfo

        return {
          type: 'error',
          title: t('project-alert-banner:project-closed.title'),
          details:
            hasPermission('project:administer') && reason
              ? [
                  name
                    ? {
                        textColor: 'primary' as ThemeTextColor,
                        text: t(
                          'project-alert-banner:project-closed.closed-by',
                          {
                            name,
                            timestamp: getFullDateTimeString(timestamp),
                          }
                        ),
                      }
                    : undefined,
                  {
                    textColor: 'secondary' as ThemeTextColor,
                    text: `${t('project-alert-banner:project-closed.reason')}: ${reason}`,
                  },
                ]
              : [
                  {
                    textColor: 'secondary' as ThemeTextColor,
                    text: t(
                      'project-alert-banner:project-closed.reason-placeholder'
                    ),
                  },
                ],
        }
      }
    }

    if (
      project.status === 'processing_bids' &&
      principal.authz.teamIds.includes(project.brandTeamId)
    ) {
      return {
        type: 'info',
        title: t('project-alert-banner:processing-bids.title'),
      }
    }

    if (
      project.status === 'bidding_open' &&
      principal.authz.teamIds.includes(project.brandTeamId)
    ) {
      return {
        type: 'notice',
        title: t('project-alert-banner:bidding-open.title'),
        subTitle: t('project-alert-banner:bidding-open.subtitle'),
      }
    }

    if (
      project.status === 'bidding_open' &&
      principal.authz.organizationType === 'agency' &&
      project.bids?.some((bid) => bid.revision > 0 && bid.status === 'draft')
    ) {
      return {
        type: 'notice',
        title: t('project-alert-banner:bidding-reopened.title'),
        subTitle: t('project-alert-banner:bidding-reopened.subtitle'),
      }
    }

    if (
      project.status === 'awarded' &&
      principal.authz.teamIds.includes(project.brandTeamId)
    ) {
      return {
        type: 'notice',
        title: t('project-alert-banner:awarded.title'),
        subTitle: t('project-alert-banner:awarded.subtitle'),
      }
    }

    if (
      principal.authz.organizationType === 'agency' &&
      project.agencyTeamId &&
      !principal.authz.teamIds.includes(project.agencyTeamId)
    ) {
      return {
        type: 'warning',
        title: t('project-alert-banner:expired.title'),
      }
    }
  }

  const alertText = getAlertText()

  if (!alertText) {
    return
  }

  return (
    <Alert
      dataTestId="project-page-alert"
      dataTrackingId="project-page-alert"
      type={alertText.type as AlertType}
    >
      <Alert.Main>
        <Alert.Indicator />
        <Alert.Details>
          <Alert.Title>{alertText.title}</Alert.Title>
          <Alert.Subtitle>{alertText.subTitle}</Alert.Subtitle>
        </Alert.Details>
      </Alert.Main>
      {isNonEmptyArray(alertText.details) && (
        <Alert.Footer className="gap-4">
          {alertText.details.map((detail, index) => (
            <Text
              key={`${index}-${detail?.text}`}
              textColor={detail?.textColor}
            >
              {detail?.text}
            </Text>
          ))}
        </Alert.Footer>
      )}
    </Alert>
  )
}
