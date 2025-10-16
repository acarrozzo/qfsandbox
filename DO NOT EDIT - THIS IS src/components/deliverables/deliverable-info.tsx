import {
  type DeliverableDetails,
  isVideoDeliverable,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Blade, Stack } from '@mntn-dev/ui-components'

import { getDeliverableName } from '~/lib/deliverables/deliverable-helpers.ts'

export const DeliverableInfo = ({
  deliverable,
  serviceName,
}: {
  deliverable: DeliverableDetails
  serviceName: string
}) => {
  const { t } = useTranslation(['project-deliverables', 'generic'])

  return (
    <Stack grow direction="col" gap="1" justifyContent="center">
      <Blade.MediaInfo
        media={{
          duration:
            // TODO: QF-2405 - Remove this hack once we have a way to allow users to set properties for video variations
            // A duration of 1 is a special case for video deliverables that is used to indicate that the video is the
            // same length as the concept video. We don't want to show the duration for this case.
            isVideoDeliverable(deliverable) && deliverable.duration !== 1
              ? deliverable.duration
              : undefined,
          timeInterval: t('seconds'),
          description: getDeliverableName(deliverable, serviceName),
          aspectRatio: isVideoDeliverable(deliverable)
            ? deliverable.aspectRatio
            : undefined,
        }}
        t={(key) => (key === 'or' ? t('generic:or') : '')}
      />
    </Stack>
  )
}
