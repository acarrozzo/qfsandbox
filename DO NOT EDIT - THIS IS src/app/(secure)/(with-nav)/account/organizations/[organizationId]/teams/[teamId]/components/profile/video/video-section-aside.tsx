'use client'

import { AnimatePresence, motion } from 'motion/react'

import { Button, getChildTestIds } from '@mntn-dev/ui-components'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'
import { VideoTagFilters } from './video-tag-filters.tsx'

export const VideoSectionAside = () => {
  const { filtersOpen, setFiltersOpen, dataTestId, dataTrackingId } =
    useTeamProfileEditorContext()
  const handleFiltersClick = () => {
    setFiltersOpen(!filtersOpen)
  }

  return (
    <AnimatePresence>
      {filtersOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: [0, 400, 400],
            opacity: [0, 0, 1],
            borderColor: [
              'transparent',
              'transparent',
              'rgba(255,255,255,0.1)',
            ],
            transition: {
              type: 'tween',
              times: [0, 0.7, 1],
              ease: ['easeOut', 'easeIn'],
              duration: 0.4,
            },
          }}
          exit={{
            width: 0,
            opacity: 0,
            borderColor: 'transparent',
          }}
          className="absolute top-0 left-0 border-r"
        >
          <div className="flex flex-col gap-4 p-8">
            <motion.div
              className="absolute top-8 right-8"
              animate={{
                opacity: filtersOpen ? 1 : 0,
                right: filtersOpen ? '2rem' : '1rem',
                transition: { duration: 0.2, delay: 0.3 },
              }}
            >
              <Button
                iconLeft="chevron-left"
                iconRight="filter"
                iconFill="outline"
                size="sm"
                variant="secondary"
                onClick={handleFiltersClick}
                {...getChildTestIds(
                  { dataTestId, dataTrackingId },
                  'filter-panel-close'
                )}
              />
            </motion.div>
            <VideoTagFilters
              dataTestId={dataTestId}
              dataTrackingId={dataTrackingId}
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
