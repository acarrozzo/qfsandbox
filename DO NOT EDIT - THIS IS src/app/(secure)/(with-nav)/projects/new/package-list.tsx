'use client'

import { useEffect, useMemo, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { useCookieParams } from '@mntn-dev/app-navigation/client'
import { route } from '@mntn-dev/app-routing'
import { PartnerProgramLogo } from '@mntn-dev/app-ui-components/partner-program-logo'
import {
  type FinanceEntityId,
  isMNTNCreativeProgram,
  type PackageDomainQueryModel,
  PackageId,
  type PackageSource,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { PackageDomainQueryModelWithAcl } from '@mntn-dev/package-service/client'
import type { CreateProjectInput } from '@mntn-dev/project-service'
import {
  Button,
  CurrencyCreditContainer,
  CurrencyCreditToggle,
  LoadingOverlay,
  PageHeader,
  ResponsiveGridLayout,
  Select,
  SidebarLayoutContent,
  Stack,
} from '@mntn-dev/ui-components'
import { isNonEmptyArray, keyBy } from '@mntn-dev/utilities'

import { EmptyState } from '#components/shared/empty-state.tsx'
import {
  getCreditProgramKindByPackageSource,
  getPackageSourceByCreditProgramKind,
} from '#utils/pricing/use-pricing.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { SingleColumn } from '~/components/layout/single-column/single-column.tsx'
import { PackageCard } from '~/components/package/index.ts'
import { useRefetchProject } from '~/components/projects/use-refetch-project.ts'
import { useCanUserSeePackage } from '~/hooks/secure/use-can-user-see-package.ts'
import { useFinanceEntityId } from '~/hooks/secure/use-finance-entity-id.ts'
import { useOrganizationPartnerPrograms } from '~/hooks/secure/use-organization-partner-programs.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'

import { ProjectCreateModal } from '../components/project-create-modal.tsx'
import { QuickviewModal } from './quickview-modal.tsx'

type PackageListProps = {
  initialData: Array<PackageDomainQueryModelWithAcl>
  initialFinanceEntityId?: FinanceEntityId
}

const emptyPackage: PackageDomainQueryModel = {
  packageId: PackageId.Empty,
  packageUrn: `urn:package:${PackageId.Empty}`,
  name: '',
  description: '',
  status: 'draft',
  visibility: 'internal',
  packageSource: 'ctv',
  cost: 0,
  costPlusMargin: 0,
}

export const PackageList = ({
  initialData,
  initialFinanceEntityId,
}: PackageListProps) => {
  const { t } = useTranslation([
    'generic',
    'projects-new',
    'partner-programs',
    'pricing',
  ])
  const { canUserSeePackage } = useCanUserSeePackage()

  const { principal } = usePrincipal()

  const { __referenceFileUrl: referenceFileUrl } = useCookieParams()

  const { financeEntityId } = useFinanceEntityId({
    initialData: initialFinanceEntityId,
  })

  const { allowedProjectCreditKinds, partnerPrograms } =
    useOrganizationPartnerPrograms()

  const [activePackageId, setActivePackageId] = useState<PackageId | null>(null)
  const [quickviewPackage, setQuickviewPackage] =
    useState<PackageDomainQueryModel | null>(null)
  const [packageSource, setPackageSource] = useState<PackageSource | undefined>(
    undefined
  )
  const [creditBalance, setCreditBalance] = useState<number | undefined>(
    undefined
  )
  const [showCredits, setShowCredits] = useState<boolean>(true)
  const toggleShowCredits = () => setShowCredits((prev) => !prev)

  const mntnCreditProgram = useMemo(
    () =>
      partnerPrograms?.find(
        (program) => program.creditProgramKind === 'mntn_credits'
      ),
    [partnerPrograms]
  )

  const queryFilters = useMemo(
    () => (packageSource ? { packageSource } : {}),
    [packageSource]
  )

  const {
    data: packagesList = [],
    refetch: refetchPackages,
    isRefetching,
  } = trpcReactClient.packages.getCreditFilteredPackages.useQuery(
    {
      packages: { ...queryFilters },
      financeEntityId:
        principal.authz.organizationType === 'internal'
          ? undefined
          : financeEntityId,
    },
    {
      initialData,
    }
  )

  const packages = useMemo(
    () =>
      packagesList.filter((pkg) =>
        canUserSeePackage({ packageSource: pkg.packageSource })
      ) ?? [],
    [packagesList, canUserSeePackage]
  )

  const packageMap = useMemo(() => keyBy(packages, 'packageId'), [packages])
  const activePackage = useMemo(
    () => (activePackageId ? packageMap[activePackageId] : undefined),
    [activePackageId, packageMap]
  )

  const router = useRouter()
  const refetchProject = useRefetchProject()
  const createProject = trpcReactClient.projects.create.useMutation()

  // todo: move this to a separate hook that either returns all for hasPermission('project:administer') or filters
  //  by partner programs + qf direct.
  const packageSourceOptions = useMemo(() => {
    const quickFrameOption = {
      value: 'quickframe' as const,
      label: t('partner-programs:short-name.quickframe'),
      icon: <PartnerProgramLogo partnerProgram="quickframe" size="sm" />,
    }

    const programOptions =
      allowedProjectCreditKinds.map((creditProgramKind) => {
        return {
          value: getPackageSourceByCreditProgramKind(creditProgramKind),
          label: t(`partner-programs:short-name.${creditProgramKind}`),
          icon: (
            <PartnerProgramLogo partnerProgram={creditProgramKind} size="sm" />
          ),
        }
      }) ?? []

    return [quickFrameOption, ...programOptions]
  }, [t, allowedProjectCreditKinds])

  const canUseCreditProgram = (packageSource: PackageSource) => {
    const creditProgramKind = getCreditProgramKindByPackageSource(packageSource)

    if (!creditProgramKind) {
      return false
    }

    return allowedProjectCreditKinds.includes(creditProgramKind)
  }

  const handlePackageClicked = (packageId: PackageId) => () => {
    setActivePackageId(packageId)
    handleCloseQuickview()
  }

  const handleQuickviewClicked = (pkg: PackageDomainQueryModel) => () => {
    setQuickviewPackage(pkg)
  }

  const handleCloseQuickview = () => {
    setQuickviewPackage(null)
  }

  const handleProjectCreate = async (input: CreateProjectInput) => {
    const createdProject = await createProject.mutateAsync({
      ...input,
      referenceFileUrl,
    })

    await refetchProject(createdProject)

    router.push(
      route('/projects/:projectId').params({
        projectId: createdProject.projectId,
      })
    )
  }

  const handleProjectCreateModalClose = () => {
    setActivePackageId(null)
  }

  useEffect(() => {
    const isNonMNTNPackageSelected =
      !!packageSource &&
      !isMNTNCreativeProgram(getCreditProgramKindByPackageSource(packageSource))

    if (isNonMNTNPackageSelected) {
      setCreditBalance(undefined)
    } else {
      setCreditBalance(mntnCreditProgram?.creditBalance)
    }
    refetchPackages()
  }, [mntnCreditProgram, packageSource, refetchPackages])

  return (
    <>
      <SidebarLayoutContent>
        <PageHeader dataTestId="new-project-packages-page-header">
          <PageHeader.Main>
            <PageHeader.Overline>
              <PageHeader.OverlineLink
                onClick={() => router.backOrPush(route('/dashboard'))}
              >
                {t('back', { ns: 'generic' })}
              </PageHeader.OverlineLink>
            </PageHeader.Overline>
            <PageHeader.Title title={t('projects-new:title')} />
            <PageHeader.Subtitle
              textColor="secondary"
              subtitle={t('projects-new:subtitle')}
            />
          </PageHeader.Main>
          {isNonEmptyArray(packageSourceOptions) && (
            <PageHeader.Controls>
              <Stack gap="6" alignItems="center" height="20">
                {creditBalance !== undefined && (
                  <CurrencyCreditContainer
                    currency={creditBalance}
                    currencyUnitLabel={t('pricing:currency-label.mntn_credits')}
                    label={{
                      text: t('projects-new:you-have'),
                    }}
                    dataTestId="project-minimum-price-currency-credit-container"
                    dataTrackingId="project-minimum-price-currency-credit-container"
                  />
                )}

                <Select
                  key={packageSourceOptions.map((opt) => opt.value).join('-')}
                  onChange={(value) => setPackageSource(value ?? undefined)}
                  value={packageSource || null}
                  placeholder="All"
                  className="w-64"
                  searchable={false}
                  deselectable={true}
                  dataTestId="partner-program-filter-select"
                  dataTrackingId="partner-program-filter-select"
                  options={packageSourceOptions}
                />

                <CurrencyCreditToggle
                  checked={showCredits}
                  onChange={toggleShowCredits}
                  dataTestId="project-minimum-price-toggle"
                  dataTrackingId="project-minimum-price-toggle"
                />
              </Stack>
            </PageHeader.Controls>
          )}
        </PageHeader>
        <SingleColumn>
          {isRefetching && <LoadingOverlay />}
          {!isNonEmptyArray(packages) && (
            <EmptyState subTitle="No packages to show." />
          )}
          <ResponsiveGridLayout childSize="lg" gap="12">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.packageId}
                activePackageId={activePackageId}
                pkg={pkg}
                onPackageClicked={handlePackageClicked(pkg.packageId)}
                priceContext="brand"
                hideStatus
                showCredits={
                  showCredits && canUseCreditProgram(pkg.packageSource)
                }
                actions={
                  <Button
                    variant="text"
                    size="md"
                    iconRight="eye"
                    onClick={handleQuickviewClicked(pkg)}
                    dataTestId={`package-quickview-button-${pkg.packageId}`}
                    dataTrackingId={`package-quickview-button-${pkg.packageId}`}
                  >
                    {t('quickview', { ns: 'projects-new' })}
                  </Button>
                }
              />
            ))}
          </ResponsiveGridLayout>
          <QuickviewModal
            pkg={quickviewPackage ?? emptyPackage}
            open={!!quickviewPackage}
            onClose={handleCloseQuickview}
            onPackageClicked={handlePackageClicked(
              quickviewPackage?.packageId ?? PackageId.Empty
            )}
            disabled={!!activePackageId}
            loading={activePackageId === quickviewPackage?.packageId}
          />
        </SingleColumn>
      </SidebarLayoutContent>
      <ProjectCreateModal
        packageId={activePackage?.packageId ?? PackageId.Empty}
        onCreate={handleProjectCreate}
        isCreating={createProject.isPending}
        open={!!activePackage}
        onClose={handleProjectCreateModalClose}
      />
    </>
  )
}
