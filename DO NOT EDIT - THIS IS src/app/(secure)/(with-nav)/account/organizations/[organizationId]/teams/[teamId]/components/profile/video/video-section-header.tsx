'use client'

import { AnimatePresence, motion } from 'motion/react'

import { useTranslation } from '@mntn-dev/i18n'
import { Button, getChildTestIds, Heading, Text } from '@mntn-dev/ui-components'

import { useOnboarding } from '~/hooks/secure/use-onboarding.ts'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'

export const VideoSectionHeader = () => {
  const { t } = useTranslation(['team-profile', 'generic'])
  const {
    dataTestId,
    dataTrackingId,
    filtersOpen,
    onAddVideoClick,
    setFiltersOpen,
  } = useTeamProfileEditorContext()
  const { isOnboarding } = useOnboarding()

  const handleFiltersClick = () => {
    setFiltersOpen(!filtersOpen)
  }

  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <AnimatePresence>
          {!filtersOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
            >
              <div className="mr-6">
                <Button
                  iconLeft="filter"
                  size="sm"
                  variant="secondary"
                  onClick={handleFiltersClick}
                  {...getChildTestIds(
                    { dataTestId, dataTrackingId },
                    'filter-panel-open'
                  )}
                >
                  {t('generic:filter')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Heading fontSize="3xl">{t('generic:videos')}</Heading>
        {isOnboarding && (
          <Text className="ml-4" textColor="secondary">
            {t('team-profile:more-examples')}
          </Text>
        )}
      </div>
      <Button
        iconLeft="add"
        size="sm"
        variant="secondary"
        onClick={onAddVideoClick}
        {...getChildTestIds({ dataTestId, dataTrackingId }, 'add-video')}
      >
        {t('team-profile:add-video')}
      </Button>
    </div>
  )
}
