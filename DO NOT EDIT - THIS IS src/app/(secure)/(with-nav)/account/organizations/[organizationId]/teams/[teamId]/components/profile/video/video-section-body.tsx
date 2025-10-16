'use client'

import { motion } from 'motion/react'

import type { FileListItem } from '@mntn-dev/file-service'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'
import { VideoList } from './video-list.tsx'
import { VideoSectionHeader } from './video-section-header.tsx'
export const VideoSectionBody = ({
  examples,
}: {
  examples: FileListItem[]
}) => {
  const { filtersOpen } = useTeamProfileEditorContext()

  return (
    <motion.div
      className="w-full"
      animate={{
        paddingLeft: filtersOpen ? 400 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="w-full flex flex-col gap-8 p-8">
        <VideoSectionHeader />
        <VideoList videos={examples} />
      </div>
    </motion.div>
  )
}
