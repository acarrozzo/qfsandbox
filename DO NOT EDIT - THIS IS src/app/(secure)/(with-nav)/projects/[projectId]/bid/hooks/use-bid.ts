import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  type AcceptBidFormModel,
  AcceptBidFormValidationSchema,
  SubmitBidFormValidationSchema,
} from '@mntn-dev/app-form-schemas'
import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { SelectBidOutput, SubmitBidInput } from '@mntn-dev/bid-service'
import {
  type BidSurveyType,
  BidUrn,
  type BillingMethod,
  type ClientTermsAgreement,
  type CreditTermsAgreement,
  type FileId,
  isAgreementType,
  isCreditProgramKind,
} from '@mntn-dev/domain-types'
import { isLengthValid } from '@mntn-dev/editor/utils'
import type { EditFileDetailsInput } from '@mntn-dev/files-shared'
import { useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { logger } from '@mntn-dev/logger'
import { createContext, useToast } from '@mntn-dev/ui-components'

import { useProjectPricing } from '#utils/pricing/use-project-pricing.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'
import { useBidPricing } from '~/utils/pricing/use-bid-pricing.ts'

import { useBiddingAgreements } from './use-bidding-agreements.ts'

type UseBidArgs = {
  initialBid: SelectBidOutput
}

export function useBid({ initialBid }: UseBidArgs) {
  const { t } = useTranslation(['bids', 'toast'])
  const { t: tValidation } = useTranslation(['validation', 'bids'])
  const { showToast } = useToast()
  const router = useRouter()
  const { principal } = usePrincipal()

  /* State */
  const [editingFileId, setEditingFileId] = useState<FileId | undefined>(
    undefined
  )
  const [showConfirmModal, setShowConfirmModal] = useState<
    'accept-bid' | 'reject-final-bid' | 'withdraw' | undefined
  >(undefined)

  const [showSurvey, setShowSurvey] = useState<
    Extract<BidSurveyType, 'maker-bid-accepted-by-brand'> | undefined
  >()

  /* Data Fetchers */
  const {
    data: { bid },
    refetch: refetchBid,
  } = trpcReactClient.bids.selectBid.useQuery(
    { bidId: initialBid.bidId },
    {
      initialData: { bid: initialBid },
    }
  )

  const {
    data: exampleVideos,
    isLoading: exampleVideosLoading,
    refetch: refetchExampleVideos,
  } = trpcReactClient.files.list.useQuery({
    where: {
      folderUrn: BidUrn(bid.bidId),
      area: 'bids.examples',
    },
  })

  const projectQuery =
    trpcReactClient.projects.getProjectDetailsPayloadById.useQuery({
      projectId: bid.projectId,
    })

  const servicesQuery =
    trpcReactClient.projects.getProjectServicesByProjectId.useQuery(
      bid.projectId,
      { enabled: projectQuery.data?.mode === 'full' }
    )

  // if project query data is not available, use the project from the bid
  const project =
    projectQuery.data?.mode === 'full' ? projectQuery.data.project : bid.project
  const { refetch: refetchProject } = projectQuery

  const agreements = useBiddingAgreements()

  const { creditCosts, creditProgramKind } = useBidPricing(
    bid,
    project,
    project.package?.packageSource
  )

  const { getProjectCurrency } = useProjectPricing(project)

  const getFixedProjectCostPlusMargin = () => {
    const { credits, dollars } = getProjectCurrency('brand', project)
    return `${credits} ${credits && dollars ? '+' : ''} ${dollars}`
  }

  /* Mutations */
  const acceptBid = trpcReactClient.bids.acceptBid.useMutation()
  const archiveFile = trpcReactClient.files.archiveFile.useMutation()
  const discardBid = trpcReactClient.bids.discardBid.useMutation()
  const editFileDetails = trpcReactClient.files.editFileDetails.useMutation()
  const rejectBid = trpcReactClient.bids.rejectBid.useMutation()
  const setProjectChosenBillingMethod =
    trpcReactClient.finance.setProjectChosenBillingMethod.useMutation()
  const submitBid = trpcReactClient.bids.submitBid.useMutation()
  const updateBid = trpcReactClient.bids.updateBid.useMutation()

  /* Forms */
  type SubmitFormData = Pick<SubmitBidInput, 'bidId'> &
    Partial<Pick<SubmitBidInput, 'amount'>> & {
      pitch: string
      makerTermsAccepted: boolean
      makerProjectPaymentTermsAccepted: boolean
    }

  const bidFormDefaultValues: SubmitFormData = useMemo(
    () => ({
      bidId: bid.bidId,
      amount: bid.amount,
      pitch: bid.pitch ?? '',
      makerTermsAccepted: false,
      makerProjectPaymentTermsAccepted: false,
    }),
    [bid.bidId, bid.amount, bid.pitch]
  )

  const bidForm = useForm({
    defaultValues: bidFormDefaultValues,
    resolver: zodResolver(
      SubmitBidFormValidationSchema(tValidation),
      tValidation
    ),
  })

  const chooseBidDefaultValues = useMemo(
    () => ({
      bidId: bid.bidId,
      termsAccepted: false,
      creditTermsAccepted: false,
    }),
    [bid.bidId]
  )

  const isCreditProgramProject = isCreditProgramKind(
    project.chosenBillingMethod
  )

  const chooseBidForm = useForm({
    defaultValues: chooseBidDefaultValues,
    values: chooseBidDefaultValues,
    resolver: zodResolver(
      AcceptBidFormValidationSchema(t, isCreditProgramProject),
      tValidation
    ),
  })

  /* Handlers */

  // Bid Handlers
  const handleAcceptBid = useCallback(
    async ({
      bidId,
      termsAccepted,
      creditTermsAccepted,
    }: AcceptBidFormModel) => {
      if (!isAgreementType(agreements.clientTerms, 'client-terms')) {
        throw new Error('Terms of service agreement was not found')
      }

      if (!termsAccepted) {
        throw new Error('Terms of service agreement was not accepted')
      }

      const agreementsToSend: Array<
        ClientTermsAgreement | CreditTermsAgreement
      > = [agreements.clientTerms]

      if (isCreditProgramProject) {
        if (!isAgreementType(agreements.creditTerms, 'credit-terms')) {
          throw new Error('Credit program terms agreement was not found')
        }

        if (!creditTermsAccepted) {
          throw new Error('Credit program terms agreement was not accepted')
        }

        agreementsToSend.push(agreements.creditTerms)
      }

      if (bid.acl.canAcceptBid) {
        await acceptBid.mutateAsync({
          bidId,
          agreements: agreementsToSend,
        })

        showToast.success({
          title: t('toast:bidding.accepted.title'),
          body: t('toast:bidding.accepted.body', {
            project: project.name,
          }),
          dataTestId: 'bidding-accepted-info-toast',
          dataTrackingId: 'bidding-accepted-info-toast',
        })

        setShowConfirmModal(undefined)
        setShowSurvey('maker-bid-accepted-by-brand')

        await refetchBid()
        await refetchProject()
      }
    },
    [
      acceptBid,
      bid.acl.canAcceptBid,
      project,
      agreements.clientTerms,
      agreements.creditTerms,
      isCreditProgramProject,
      refetchBid,
      refetchProject,
      showToast,
      t,
    ]
  )

  const handleDiscardBid = async () => {
    try {
      await discardBid.mutateAsync({
        bidId: bid.bidId,
      })
    } catch (err) {
      logger.error('Failed to discard bid', { err })

      showToast.error({
        title: t('toast:bidding.errors.discard.title'),
        body: t('toast:bidding.errors.discard.body'),
        dataTestId: 'bidding-discard-error-toast',
        dataTrackingId: 'bidding-discard-error-toast',
      })

      return
    }

    showToast.success({
      title: t('toast:bidding.deleted.title'),
      body: t('toast:bidding.deleted.body', {
        project: project.name,
      }),
      dataTestId: 'bidding-deleted-info-toast',
      dataTrackingId: 'bidding-deleted-info-toast',
    })

    await refetchBid()
    await refetchProject()

    router.push(
      route('/projects/:projectId').params({
        projectId: project.projectId,
      })
    )
  }

  const handleRejectBid = useCallback(async () => {
    const { bidId } = chooseBidForm.getValues()
    if (bid.acl.canRejectBid) {
      await rejectBid.mutateAsync({
        bidId,
      })

      showToast.info({
        title: t('toast:bidding.rejected.title'),
        body: t('toast:bidding.rejected.body', {
          project: project.name,
        }),
        dataTestId: 'bidding-rejected-info-toast',
        dataTrackingId: 'bidding-rejected-info-toast',
      })

      await refetchBid()
      await refetchProject()

      router.push(
        route('/projects/:projectId').params({
          projectId: project.projectId,
        })
      )
    }
  }, [
    bid.acl.canRejectBid,
    chooseBidForm,
    project,
    refetchBid,
    refetchProject,
    rejectBid,
    router,
    showToast,
    t,
  ])

  const handleRejectBidClick = useCallback(async () => {
    if (showConfirmModal !== 'reject-final-bid') {
      const nonDeclinedBids =
        project.bids?.filter((bid) => bid.status === 'submitted') || []

      if (nonDeclinedBids.length === 1 && !showConfirmModal) {
        setShowConfirmModal('reject-final-bid')
        return
      }
    }

    await handleRejectBid()
  }, [showConfirmModal, project.bids, handleRejectBid])

  const handleSubmitBid = useCallback(
    async ({
      bidId,
      amount,
      pitch,
      makerTermsAccepted,
      makerProjectPaymentTermsAccepted,
    }: SubmitFormData) => {
      try {
        if (!isAgreementType(agreements.makerTerms, 'maker-terms')) {
          throw new Error('Project greenlight agreement not found')
        }

        if (
          !isAgreementType(
            agreements.makerProjectPaymentTerms,
            'maker-project-payment-terms'
          )
        ) {
          throw new Error('Maker project payment terms not found')
        }

        if (!makerTermsAccepted) {
          throw new Error('Maker terms not accepted')
        }

        if (!makerProjectPaymentTermsAccepted) {
          throw new Error('Maker payment terms not accepted')
        }

        if (amount === undefined) {
          throw new Error('Bid amount is required')
        }

        if (!isLengthValid(pitch, { min: 1 })) {
          throw new Error('Bid pitch is required')
        }

        await submitBid.mutateAsync({
          bidId,
          amount,
          pitch,
          agreements: [
            agreements.makerTerms,
            agreements.makerProjectPaymentTerms,
          ],
        })
      } catch (err) {
        logger.error('Failed to submit bid', { err })

        showToast.error({
          title: t('toast:bidding.errors.submit.title'),
          body: t('toast:bidding.errors.submit.body'),
          dataTestId: 'bidding-submit-error-toast',
          dataTrackingId: 'bidding-submit-error-toast',
        })

        return
      }

      showToast.success({
        title: t('toast:bidding.submitted.title'),
        body: t('toast:bidding.submitted.body', {
          project: project.name,
        }),
        dataTestId: 'bidding-submitted-info-toast',
        dataTrackingId: 'bidding-submitted-info-toast',
      })

      await refetchBid()
      await refetchProject()

      router.push(
        route('/projects/:projectId').params({
          projectId: project.projectId,
        })
      )
    },
    [
      agreements.makerTerms,
      agreements.makerProjectPaymentTerms,
      project,
      refetchBid,
      refetchProject,
      router,
      showToast,
      submitBid,
      t,
    ]
  )

  const handleUpdateBid = useCallback(
    async (data: SubmitFormData) => {
      try {
        await updateBid.mutateAsync({
          bidId: data.bidId,
          ...(data.pitch && { pitch: data.pitch }),
          ...(data.amount && { amount: data.amount }),
        })
      } catch (err) {
        logger.error('Failed to update bid', { err })

        showToast.error({
          title: t('toast:bidding.errors.update.title'),
          body: t('toast:bidding.errors.update.body'),
          dataTestId: 'bidding-update-error-toast',
          dataTrackingId: 'bidding-update-error-toast',
        })

        return
      }

      showToast.success({
        title: t('toast:bidding.draft-saved.title'),
        body: t('toast:bidding.draft-saved.body', {
          project: project.name,
        }),
        dataTestId: 'bidding-draft-saved-info-toast',
        dataTrackingId: 'bidding-draft-saved-info-toast',
      })

      await refetchBid()
      await refetchProject()

      router.push(
        route('/projects/:projectId').params({
          projectId: project.projectId,
        })
      )
    },
    [project, refetchBid, refetchProject, router, showToast, t, updateBid]
  )

  const handleSetChosenBillingMethod = async (
    chosenBillingMethod: BillingMethod
  ) => {
    await setProjectChosenBillingMethod.mutateAsync({
      projectId: project.projectId,
      billingMethod: chosenBillingMethod,
    })

    await refetchBid()
    await refetchProject()
  }

  const handleWithdrawBid = useCallback(async () => {
    if (bid.acl.canUpdateBid) {
      await updateBid.mutateAsync({
        bidId: bid.bidId,
      })

      await refetchBid()
      await refetchProject()

      router.push(
        route('/projects/:projectId/bid/:bidId/edit').params({
          projectId: project.projectId,
          bidId: bid.bidId,
        })
      )
    }
  }, [bid, project, refetchProject, refetchBid, router, updateBid])

  // Example Video Handlers
  const handleDeleteVideo = useCallback(
    async (fileId: FileId) => {
      await archiveFile.mutateAsync({
        fileId,
      })
      await refetchExampleVideos()
    },
    [archiveFile, refetchExampleVideos]
  )

  const handleSaveVideo = useCallback(
    async (values: EditFileDetailsInput) => {
      try {
        await editFileDetails.mutateAsync(values)
      } catch (err) {
        logger.error(
          `Failed to edit example video ${values.fileId} on bid ${bid.bidId}`,
          { err }
        )
      }

      setEditingFileId(undefined)
    },
    [bid.bidId, editFileDetails]
  )

  const [showCurrencyChooser, setShowCurrencyChooser] = useState(false)

  useEffect(() => {
    setShowCurrencyChooser(
      project.billingMethods.length > 1 &&
        principal.authz.organizationType === 'brand' &&
        !creditProgramKind // todo: temporarily remove currency chooser for credit programs as part of QFMP-3979
    )
  }, [
    principal.authz.organizationType,
    creditProgramKind,
    project.billingMethods,
  ])

  return {
    acceptBid,
    agencyTeamId: bid.agencyTeamId,
    archiveFile,
    agreements,
    bid: bid,
    bidForm,
    bidId: bid.bidId,
    brandOrganizationId: principal.authz.organizationId,
    chooseBidForm,
    creditCosts,
    creditProgramKind,
    services: servicesQuery.data,
    discardBid,
    editFileDetails,
    editingFileId,
    exampleVideos,
    exampleVideosLoading,
    getFixedProjectCostPlusMargin,
    handleAcceptBid,
    handleSetChosenBillingMethod,
    handleDeleteVideo,
    handleDiscardBid,
    handleRejectBid,
    handleRejectBidClick,
    handleSaveVideo,
    handleSubmitBid,
    handleUpdateBid,
    handleWithdrawBid,
    project,
    refetchBid,
    refetchExampleVideos,
    rejectBid,
    setEditingFileId,
    setShowConfirmModal,
    setProjectChosenBillingMethod,
    showConfirmModal,
    showCurrencyChooser,
    submitBid,
    updateBid,
    showSurvey,
  }
}

export const [BidProvider, useBidContext] = createContext<
  ReturnType<typeof useBid>
>({
  name: 'BidContext',
})
