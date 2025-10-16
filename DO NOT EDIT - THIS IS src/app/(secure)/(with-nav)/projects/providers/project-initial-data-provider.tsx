'use client'

import { createContext, type PropsWithChildren, useContext } from 'react'

import type { ListBidsOutput } from '@mntn-dev/bid-service/client'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PreProductionSelectReviewsForProjectOutput } from '@mntn-dev/review-service'

const ProjectInitialDataContext = createContext<{
  initialProject: ProjectWithAcl
  initialServices: ProjectServiceWithAcl[]
  initialBids?: ListBidsOutput
  initialPreProductionReviews?: PreProductionSelectReviewsForProjectOutput
} | null>(null)

type Props = PropsWithChildren<{
  initialProject: ProjectWithAcl
  initialServices: ProjectServiceWithAcl[]
  initialBids?: ListBidsOutput
  initialPreProductionReviews?: PreProductionSelectReviewsForProjectOutput
}>

export const ProjectInitialDataProvider = ({
  children,
  initialProject,
  initialServices,
  initialBids,
  initialPreProductionReviews,
}: Props) => {
  return (
    <ProjectInitialDataContext.Provider
      value={{
        initialProject,
        initialServices,
        initialBids,
        initialPreProductionReviews,
      }}
    >
      {children}
    </ProjectInitialDataContext.Provider>
  )
}

const useProjectInitialDataContext = () => {
  const context = useContext(ProjectInitialDataContext)
  if (!context) {
    throw new Error(
      'useProjectInitialDataContext must be used under a ProjectInitialDataProvider'
    )
  }
  return context
}

export const useInitialProjectQueryData = () => {
  const {
    initialProject,
    initialServices,
    initialBids,
    initialPreProductionReviews,
  } = useProjectInitialDataContext()
  return {
    project: initialProject,
    services: initialServices,
    bids: initialBids,
    preProductionReviews: initialPreProductionReviews,
  }
}
