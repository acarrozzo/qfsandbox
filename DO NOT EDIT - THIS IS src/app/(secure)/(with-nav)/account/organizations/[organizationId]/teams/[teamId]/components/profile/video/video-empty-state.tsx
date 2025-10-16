'use client'

import { useTranslation } from '@mntn-dev/i18n'
import { Button, Heading, Text } from '@mntn-dev/ui-components'

import { EmptyState } from '~/components/empty/index.ts'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'

const testId = 'team-profile-videos-empty-state'

export const VideoEmptyState = () => {
  const { onAddVideoClick } = useTeamProfileEditorContext()
  const { t } = useTranslation('team-profile')

  return (
    <EmptyState border id="team-profile">
      <EmptyState.CallToAction
        heading={
          <>
            <Text textColor="brand" fontSize="lg">
              {t('empty-state.overline')}
            </Text>
            <Heading fontSize="3xl">{t('empty-state.title')}</Heading>
          </>
        }
        button={
          <Button
            variant="primary"
            iconLeft="add"
            onClick={onAddVideoClick}
            dataTestId={`${testId}-add-video`}
            dataTrackingId={`${testId}-add-video`}
          >
            {t('add-video')}
          </Button>
        }
      />
    </EmptyState>
  )
}
