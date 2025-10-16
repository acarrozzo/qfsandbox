'use client'

import { useState } from 'react'

import type { ProjectWithAcl } from '@mntn-dev/project-service'

import { useMe } from '~/hooks/secure/use-me.ts'

export const useEditProjectToggle = (project: ProjectWithAcl) => {
  const { me } = useMe()
  const [isEditing, setIsEditing] = useState(false)

  const forceEditMode = !!(
    me.organizationType === 'brand' && project.acl.canEditProject
  )

  const toggleEditing = () => setIsEditing((current) => !current)

  return { isEditing: isEditing || forceEditMode, toggleEditing }
}
