import { useState } from 'react'

import {
  FileId,
  isMNTNCreativeProgram,
  type PackageDomainQueryModel,
  serviceWithDeliverables,
  serviceWithoutDeliverables,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  CurrencyCreditContainer,
  Heading,
  List,
  Modal,
  ModalOverlineHeader,
  type ModalProps,
  SkeletonParagraph,
  Stack,
  Surface,
  Tabs,
  Text,
} from '@mntn-dev/ui-components'
import { themeTextColorMap } from '@mntn-dev/ui-theme'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import {
  getCreditProgramKindByPackageSource,
  usePricing,
} from '#utils/pricing/use-pricing.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { Viewer } from '~/components/files/viewer/viewer.tsx'
import { CenteredLoadingSpinner } from '~/components/shared/centered-loading-spinner.tsx'
import { getPackageFileQueryInputs } from '~/lib/packages/package-query-helpers'

type PackageModalProps = Omit<ModalProps, 'children'> &
  Readonly<{
    pkg: PackageDomainQueryModel
    onPackageClicked: () => void
    disabled: boolean
    loading: boolean
  }>

export const QuickviewModal = ({
  pkg,
  onPackageClicked,
  disabled,
  loading,
  ...props
}: PackageModalProps) => {
  const { t } = useTranslation(['generic', 'quickview'])
  const { onClose, open } = props
  const { packageId, name, description, packageSource } = pkg

  const creditProgramKind = getCreditProgramKindByPackageSource(packageSource)
  const showCredits = isMNTNCreativeProgram(creditProgramKind)

  const { creditCosts, getCurrencyLabel, getPriceValue } = usePricing(
    pkg,
    showCredits,
    pkg.packageSource
  )

  const price = getPriceValue('brand', creditCosts)

  const filesQuery = trpcReactClient.files.list.useQuery(
    getPackageFileQueryInputs(packageId),
    {
      enabled: open,
    }
  )

  const [firstFile] = filesQuery.data ?? []

  const [selectedFileId = firstFile?.fileId, setSelectedFileId] =
    useState<FileId>()

  const selectedFile = filesQuery.data?.find(
    (file) => file.fileId === selectedFileId
  )

  const packageDetailsResult =
    trpcReactClient.packages.getPackageDetails.useQuery(
      { packageId },
      { enabled: open }
    )

  const { data: packageDetails } = packageDetailsResult

  const includedServices = packageDetails?.services?.filter(
    (service) => service.serviceType === 'included'
  )

  return (
    <Modal
      {...props}
      id={`quickview-modal-${packageId}`}
      dataTestId={`quickview-modal-${packageId}`}
      className="w-full"
    >
      <Modal.Overline>
        <ModalOverlineHeader
          dataTestId="package-quickview-modal-header"
          dataTrackingId="package-quickview-modal-header"
        >
          <ModalOverlineHeader.Main>
            <ModalOverlineHeader.Overline>
              <ModalOverlineHeader.OverlineLink onClick={onClose}>
                {t('back', { ns: 'generic' })}
              </ModalOverlineHeader.OverlineLink>
            </ModalOverlineHeader.Overline>
            <ModalOverlineHeader.Title title={name} />
          </ModalOverlineHeader.Main>
        </ModalOverlineHeader>
      </Modal.Overline>
      <div className="grid h-full grid-cols-12 gap-4 w-full">
        <div className="col-span-8">
          <Surface className="h-full w-full">
            <Stack
              direction="col"
              className="h-[580px] overflow-auto"
              divide="muted"
              gap="4"
            >
              <Stack direction="col" gap="2" className="p-8">
                <Heading fontSize="2xl">
                  {t('description', { ns: 'quickview' })}
                </Heading>
                <Text textColor="tertiary" fontWeight="medium">
                  {description}
                </Text>
              </Stack>
              <Stack direction="col" gap="4" height="full" className="p-8">
                <Stack direction="row" alignItems="center" gap="4">
                  {isNonEmptyArray(filesQuery.data) && selectedFileId && (
                    <Tabs
                      current={selectedFileId}
                      type="simple"
                      onClick={(id) => setSelectedFileId(FileId(id))}
                    >
                      <Tabs.Header name={t('examples', { ns: 'quickview' })} />
                      {filesQuery.data.map((file) => (
                        <Tabs.Tab
                          key={file.fileId}
                          id={file.fileId}
                          name={
                            file.title || t('quickview:example-video-title')
                          }
                        />
                      ))}
                    </Tabs>
                  )}
                </Stack>

                {filesQuery.isLoading && <CenteredLoadingSpinner />}

                {selectedFile && (
                  <Viewer
                    file={selectedFile}
                    videoOptions={{ resizeWidthToFitParent: true }}
                  />
                )}
              </Stack>
            </Stack>
          </Surface>
        </div>
        <div className="col-span-4 grid grid-rows-12 gap-4">
          <div className="row-span-9">
            <Surface width="full" height="full" className="p-8">
              <Stack direction="col" gap="4" className="h-96 overflow-auto">
                <Heading fontSize="2xl">
                  {t('product', { ns: 'quickview' })}
                </Heading>
                <List className={themeTextColorMap.secondary}>
                  {includedServices ? (
                    includedServices
                      .filter(serviceWithDeliverables)
                      .map((service) => (
                        <List.Item key={service.serviceId}>
                          {service.count !== 1
                            ? `${service.name} (${service.count})`
                            : service.name}
                        </List.Item>
                      ))
                  ) : (
                    <SkeletonParagraph lines={4} textSize="sm" />
                  )}
                </List>
                <Heading fontSize="2xl">
                  {t('included', { ns: 'quickview' })}
                </Heading>
                <List className={themeTextColorMap.secondary}>
                  {includedServices ? (
                    includedServices
                      .filter(serviceWithoutDeliverables)
                      .map((service) => (
                        <List.Item key={service.serviceId}>
                          {service.count !== 1
                            ? `${service.name} (${service.count})`
                            : service.name}
                        </List.Item>
                      ))
                  ) : (
                    <SkeletonParagraph lines={8} textSize="sm" />
                  )}
                </List>
              </Stack>
            </Surface>
          </div>
          <div className="row-span-3">
            <Surface width="full" height="full" className="p-8">
              <Stack direction="col" gap="2">
                {(!creditProgramKind || showCredits) && price !== undefined && (
                  <CurrencyCreditContainer
                    currency={price}
                    currencyUnitLabel={getCurrencyLabel(
                      'brand',
                      showCredits,
                      pkg.packageSource
                    )}
                    label={{
                      text: t('quickview:starting-at'),
                      fontSize: 'xs',
                    }}
                    numeric={{ fontSize: '3xl' }}
                    symbol={{ fontSize: 'xl' }}
                    dataTestId={`quickview-${pkg.packageId}-currency-credit-container`}
                    dataTrackingId={`quickview-${pkg.packageId}-currency-credit-container`}
                  />
                )}
                <Button
                  disabled={disabled}
                  loading={loading}
                  onClick={onPackageClicked}
                  iconRight="arrow-right"
                >
                  {t('start-here', { ns: 'quickview' })}
                </Button>
              </Stack>
            </Surface>
          </div>
        </div>
      </div>
    </Modal>
  )
}
