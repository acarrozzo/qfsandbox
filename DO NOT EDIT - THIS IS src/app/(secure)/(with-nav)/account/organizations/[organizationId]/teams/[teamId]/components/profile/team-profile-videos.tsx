'use client'

import { isNilOrEmptyArray } from '@mntn-dev/utilities'

import { useTeamProfileEditorContext } from '../../hooks/use-team-profile-editor.ts'
import { VideoEmptyState } from './video/video-empty-state.tsx'
import { VideoSectionAside } from './video/video-section-aside.tsx'
import { VideoSectionBody } from './video/video-section-body.tsx'

export const TeamProfileVideos = () => {
  const { filteredExamples } = useTeamProfileEditorContext()

  if (isNilOrEmptyArray(filteredExamples)) {
    return <VideoEmptyState />
  }

  return (
    <div className="w-full relative">
      <VideoSectionAside />
      <VideoSectionBody examples={filteredExamples} />
    </div>
  )
}
