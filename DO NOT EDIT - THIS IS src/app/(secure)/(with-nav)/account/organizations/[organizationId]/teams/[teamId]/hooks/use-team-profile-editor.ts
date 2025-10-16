'use client'

import type { TFunction } from 'i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  defaultTeamTagCategoryMap,
  getTagIdsFromCategorizedList,
  type TrpcReactUtilsClient,
} from '@mntn-dev/app-common'
import {
  type EditTeamProfileFormModel,
  EditTeamProfileFormModelSchema,
  getEditTeamProfileFormValidationSchema,
} from '@mntn-dev/app-form-schemas'
import { redirect } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import {
  type FileId,
  PublicTagCategories,
  type PublicTagCategory,
  type TagId,
  TeamUrn,
  toTagsByCategoryMap,
} from '@mntn-dev/domain-types'
import { clientAllowedFormatsMap } from '@mntn-dev/files-shared'
import {
  createGetFieldLabelFactory,
  useForm,
  zodResolver,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { UpdateTeamWithProfileInputSchema } from '@mntn-dev/team-service/client'
import { createContext, useToast } from '@mntn-dev/ui-components'
import { isNilOrEmptyArray } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useUploadWidget } from '~/app/file-tools.ts'
import { flattenTags } from '~/lib/tags/tag-helpers.ts'

import { useRefreshTeams } from '../../hooks/use-refresh-teams.ts'
import type { TeamDetailsPageProps } from '../types.ts'

const removeTag = (tagIds: TagId[] | undefined, tagId: TagId) => {
  const newList = tagIds?.filter((id) => id !== tagId)

  return isNilOrEmptyArray(newList) ? undefined : newList
}

const getTeamProfileFormFieldLabel = createGetFieldLabelFactory(
  UpdateTeamWithProfileInputSchema,
  'team-profile'
)

const TeamProfileUpdateFormValidationSchema = (
  tValidation: TFunction<'validation'>,
  trpcClient: TrpcReactUtilsClient,
  fieldLabel: string,
  ignoreName?: string
) => {
  const schema = getEditTeamProfileFormValidationSchema(
    tValidation,
    trpcClient,
    fieldLabel,
    ignoreName
  )

  return schema
}

export function useTeamProfileEditor({
  organizationId,
  teamId,
}: TeamDetailsPageProps) {
  const [editing, setEditing] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [tagFilter, setTagFilter] = useState<TagId[] | undefined>(undefined)
  const [deleteConfirmationFileId, setDeleteConfirmationFileId] = useState<
    FileId | undefined
  >(undefined)

  const { showToast } = useToast()

  const trpcClient = trpcReactClient.useUtils().client

  const { t } = useTranslation(['team-details', 'toast'])
  const { t: tValidation } = useTranslation('validation')

  const [allTags] = trpcReactClient.tags.discover.useSuspenseQuery({
    category: PublicTagCategories,
  })

  const [team, { fetchStatus: teamFetchStatus }] =
    trpcReactClient.teams.getTeamWithProfile.useSuspenseQuery({
      teamId,
    })

  const [examples] = trpcReactClient.files.list.useSuspenseQuery({
    where: {
      folderUrn: TeamUrn(teamId),
      area: 'teams.profiles.examples',
    },
  })

  const examplesWithTags = useMemo(
    () =>
      examples.map((example) => {
        const tagList = flattenTags(example.tags)

        return { ...example, tagList }
      }),
    [examples]
  )

  const filteredExamples = useMemo(() => {
    if (!tagFilter) {
      return examplesWithTags
    }

    return examplesWithTags.filter((example) => {
      return example.tagList?.some((tagId) => tagFilter.includes(tagId))
    })
  }, [examplesWithTags, tagFilter])

  // TODO: should we do this on the backend?
  const allExampleTags = useMemo(
    () =>
      toTagsByCategoryMap(
        examples.flatMap(({ tags = [] }) =>
          tags.filter((tag) =>
            PublicTagCategories.includes(tag.category as PublicTagCategory)
          )
        )
      ),
    [examples]
  )

  const handleFilterChange = useCallback((adding: boolean, tagId: TagId) => {
    setTagFilter((tagIds) =>
      adding ? [...(tagIds ?? []), tagId] : removeTag(tagIds ?? [], tagId)
    )
  }, [])

  if (!team) {
    redirect(route('/account').toRelativeUrl())
  }

  const testId = useMemo(() => `team-${teamId}-team-profile-editor`, [teamId])

  const updateTeamWithProfile =
    trpcReactClient.teams.updateTeamWithProfile.useMutation()

  const editFileDetails = trpcReactClient.files.editFileDetails.useMutation()
  const updateTagList = trpcReactClient.tags.updateTagList.useMutation()
  const updateExampleTagList = trpcReactClient.tags.updateTagList.useMutation()
  const archiveFile = trpcReactClient.files.archiveFile.useMutation()

  const profileUpdateModel: EditTeamProfileFormModel = useMemo(
    () =>
      EditTeamProfileFormModelSchema.parse({
        ...team,
        tags: {
          ...defaultTeamTagCategoryMap,
          ...toTagsByCategoryMap(team.tags),
        },
      }),
    [team]
  )

  const validationSchema = useMemo(
    () =>
      TeamProfileUpdateFormValidationSchema(
        tValidation,
        trpcClient,
        t('team-details:field.name'),
        team.name
      ),
    [tValidation, t, trpcClient, team.name]
  )

  const form = useForm({
    defaultValues: profileUpdateModel,
    resolver: zodResolver(validationSchema, tValidation, undefined, {
      fieldLabelConfig: {
        getFieldLabel: getTeamProfileFormFieldLabel(tValidation),
      },
      mode: 'async',
    }),
  })

  useEffect(() => {
    form.reset(profileUpdateModel)
  }, [profileUpdateModel, form])

  const refreshTeams = useRefreshTeams()

  const saveForm = useCallback(
    async (data: EditTeamProfileFormModel) => {
      const team = UpdateTeamWithProfileInputSchema.parse(data)

      await updateTeamWithProfile.mutateAsync(team)
      await updateTagList.mutateAsync({
        tagListId: teamId,
        tagIds: getTagIdsFromCategorizedList(data.tags),
      })
      await refreshTeams({ teamId, organizationId })

      setEditing(false)
    },
    [updateTagList, updateTeamWithProfile, organizationId, teamId, refreshTeams]
  )

  const handleFileUploadSuccess = useCallback(() => {
    refreshTeams({ teamId, organizationId })
  }, [refreshTeams, teamId, organizationId])

  const handleFileDetailsUpdateSuccess = useCallback(() => {
    refreshTeams({ teamId, organizationId })
  }, [refreshTeams, teamId, organizationId])

  const { open } = useUploadWidget({
    fileArea: 'teams.profiles.examples',
    category: 'video',
    folderUrn: TeamUrn(teamId),
    options: {
      clientAllowedFormats: clientAllowedFormatsMap.video,
      resourceType: 'video',
      sources: ['local', 'camera', 'dropbox', 'google_drive'],
      multiple: false,
    },
    onAfterUpload: handleFileUploadSuccess,
  })

  const handleAddClick = useCallback(() => {
    open()
  }, [open])

  const handleDeleteClick = useCallback(
    (fileId: FileId) => {
      if (examples.length <= 1) {
        showToast.error({
          title: t('toast:team.error.must-have-one-video.title'),
          body: t('toast:team.error.must-have-one-video.body'),
        })
        return
      }

      setDeleteConfirmationFileId(fileId)
    },
    [examples.length, showToast, t]
  )

  const handleFileDeleteConfirm = useCallback(async () => {
    if (deleteConfirmationFileId) {
      await archiveFile.mutateAsync({ fileId: deleteConfirmationFileId })
      setDeleteConfirmationFileId(undefined)
    }
  }, [archiveFile, deleteConfirmationFileId])

  const handleFileDeleteCancel = useCallback(() => {
    setDeleteConfirmationFileId(undefined)
  }, [])

  const handleToggleEditing = useCallback(() => {
    setEditing((e) => !e)
  }, [])

  return {
    allTags: allTags ?? [],
    allExampleTags,
    avatarLoading,
    dataTestId: testId,
    dataTrackingId: testId,
    deletingVideo: archiveFile.isPending,
    editFileDetails,
    editing,
    examples: examples ?? [],
    filteredExamples,
    filtersOpen,
    form,
    onAddVideoClick: handleAddClick,
    onFileDeleteCancel: handleFileDeleteCancel,
    onFileDeleteClick: handleDeleteClick,
    onFileDeleteConfirm: handleFileDeleteConfirm,
    onFileDetailsUpdateSuccess: handleFileDetailsUpdateSuccess,
    onFileUploadSuccess: handleFileUploadSuccess,
    onFilterChange: handleFilterChange,
    onReplaceFileClick: handleAddClick,
    onToggleEditing: handleToggleEditing,
    saveForm,
    savingAgency: updateTeamWithProfile.isPending || updateTagList.isPending,
    savingVideo: editFileDetails.isPending || updateExampleTagList.isPending,
    setAvatarLoading,
    setFiltersOpen,
    setTagFilter,
    showFileDeleteConfirmationModal: deleteConfirmationFileId !== undefined,
    tagFilter: tagFilter ?? [],
    team,
    teamId,
    updateTeamWithProfile,
    updateExampleTagList,
    isLoading: teamFetchStatus === 'fetching',
  }
}

export const [TeamProfileEditorProvider, useTeamProfileEditorContext] =
  createContext<ReturnType<typeof useTeamProfileEditor>>({
    name: 'TeamProfileEditorContext',
  })
