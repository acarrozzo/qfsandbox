import type { ReactNode } from 'react'

export type ProjectListSectionProps = {
  children: ReactNode
}

export const ProjectListSection = ({ children }: ProjectListSectionProps) => (
  <div className="w-full flex flex-col gap-8">{children}</div>
)
