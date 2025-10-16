'use client'

import { ActivityFeed, ActivityViewModelsSchema } from '@mntn-dev/app-activity'
import { useRouter } from '@mntn-dev/app-navigation'
import type { AnyRoute } from '@mntn-dev/app-routing'
import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import { useTranslation } from '@mntn-dev/i18n'
import { LoadingSpinner, Text } from '@mntn-dev/ui-components'
import { isNilOrEmptyArray } from '@mntn-dev/utilities'

import { getAvatarUrl } from '#components/avatar/helper.ts'
import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'

const AsideTabActivity = () => {
  const { activity, activityLoading } = usePreProductionReviewContext()

  const { t } = useTranslation('edit-service')
  const router = useRouter()

  const handleNavigate = (route: AnyRoute) => {
    router.push(route)
  }

  if (activityLoading) {
    return (
      <div className="flex size-full justify-center items-center">
        <LoadingSpinner className="text-brand h-24 w-24" />
      </div>
    )
  }

  if (isNilOrEmptyArray(activity)) {
    return (
      <div className="flex size-full justify-center items-center">
        <Text
          textColor="secondary"
          dataTestId="service-activity-no-activity"
          dataTrackingId="service-activity-no-activity"
        >
          {t('no-activity', { ns: 'edit-service' })}
        </Text>
      </div>
    )
  }

  return (
    <ActivityFeed
      activities={ActivityViewModelsSchema(getAvatarUrl).parse(activity)}
      image={NextImage({ unoptimized: true })}
      onNavigate={handleNavigate}
      currentUrl={window.location.pathname}
      variant="feed"
      className="bg-transparent border-none"
    />
  )
}

export { AsideTabActivity }
