import type { ReactNode } from 'react'

export type ProjectHighlightSectionProps = {
  children: ReactNode
}

export const ProjectHighlightSection = ({
  children,
}: ProjectHighlightSectionProps) => (
  <div className="w-full flex flex-col gap-8">{children}</div>
)
