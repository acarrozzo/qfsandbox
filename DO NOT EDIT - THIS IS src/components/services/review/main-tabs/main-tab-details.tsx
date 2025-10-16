'use client'

import type { ReactNode } from 'react'

import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'

import { BrandFeedback } from '../../review/main-tabs/details/brand-feedback.tsx'
import { MakerProposal } from '../../review/main-tabs/details/maker-proposal.tsx'
import type { EditingPhase } from '../types.ts'

const serviceDetailsContentMap: Record<EditingPhase, ReactNode> = {
  'brand-feedback': <BrandFeedback />,
  'maker-proposal': <MakerProposal />,
}

const MainTabDetails = () => {
  const { phase } = usePreProductionReviewContext()

  return <>{serviceDetailsContentMap[phase]}</>
}

export { MainTabDetails }
