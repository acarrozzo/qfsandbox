'use client'

import { useState } from 'react'
import { keepPreviousData } from '@tanstack/react-query'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { ProjectUrn } from '@mntn-dev/domain-types'
import type { FileListItem } from '@mntn-dev/file-service'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { SidebarLayoutContent } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { FileArchiver } from '~/components/files/file-archiver.tsx'
import { FileManagerHeader } from '~/components/files/file-manager-header.tsx'
import { FileTable } from '~/components/files/file-table.tsx'
import { useFileSearch } from '~/components/files/use-file-search.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

export function FilesPage({ project }: { project: ProjectWithAcl }) {
  const {
    me: { organizationType },
  } = useMe()
  const { projectId, name } = project
  const router = useRouter()

  const folderUrn = ProjectUrn(projectId)
  const { search, setSearch } = useFileSearch()

  const filesQuery = trpcReactClient.files.list.useQuery(
    {
      where: {
        folderUrn,
        includeChildFolders: true,
        search,
      },
    },
    { placeholderData: keepPreviousData }
  )

  const [archiveFile, setArchiveFile] = useState<FileListItem>()

  const setPreviewFile = (file: FileListItem) => {
    router.push(
      route('/projects/:projectId/files/:fileId').params({
        projectId,
        fileId: file.fileId,
      })
    )
  }

  const handleClose = () => {
    router.backOrPush(
      // Makers cannot see the project details page until they are matched to the project
      organizationType === 'agency'
        ? route('/dashboard')
        : route('/projects/:projectId').params({ projectId })
    )
  }

  const handleCloseArchiver = () => {
    setArchiveFile(undefined)
  }

  const handleFileArchived = () => {
    filesQuery.refetch()
    handleCloseArchiver()
  }

  return (
    <SidebarLayoutContent className="flex-1 flex flex-col">
      <FileManagerHeader
        folderUrn={ProjectUrn(projectId)}
        isSearching={filesQuery.isFetching}
        uploadFileArea={
          project.acl.canUploadReferenceFile
            ? 'projects.assets.reference'
            : undefined
        }
        onAfterUpload={filesQuery.refetch}
        onSearch={setSearch}
        onClose={handleClose}
        label={{ close: name }}
      />
      <FileTable
        files={filesQuery?.data ?? []}
        isError={filesQuery.isError}
        isLoading={filesQuery.isLoading}
        isFetching={filesQuery.isFetching}
        onArchiveFile={setArchiveFile}
        onPreviewFile={setPreviewFile}
      />
      {archiveFile && (
        <FileArchiver
          file={archiveFile}
          onClose={handleCloseArchiver}
          onConfirm={handleFileArchived}
        />
      )}
    </SidebarLayoutContent>
  )
}
