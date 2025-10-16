import { useState } from 'react'

import type { Description, FileId } from '@mntn-dev/domain-types'

import type { ComponentProps } from '~/types/props.ts'

import { FileDescriptionEditor } from './file-description-editor.tsx'
import { FileDescriptionViewer } from './file-description-viewer.tsx'

type Props = ComponentProps<{
  fileId: FileId
  description?: Description
  canEdit: boolean
  onChange: () => void
}>

export const FileDescription = ({
  fileId,
  description: originalDescription,
  canEdit,
  onChange,
}: Props) => {
  const [editing, setEditing] = useState(false)
  const [description, setDescription] = useState(originalDescription)

  const handleStartEditing = () => setEditing(true)

  const handleCancelEditing = () => {
    setDescription(description)
    setEditing(false)
  }

  const handleDescriptionSaved = (description?: Description) => {
    setDescription(description)
    setEditing(false)
    onChange()
  }

  return (
    <>
      {editing ? (
        <FileDescriptionEditor
          fileId={fileId}
          description={description}
          onCancel={handleCancelEditing}
          onSaved={handleDescriptionSaved}
        />
      ) : (
        <FileDescriptionViewer
          fileId={fileId}
          description={description}
          canEdit={canEdit}
          onStartEditing={handleStartEditing}
        />
      )}
    </>
  )
}
