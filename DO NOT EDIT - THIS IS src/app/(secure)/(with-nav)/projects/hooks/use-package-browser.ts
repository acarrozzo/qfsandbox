import { useState } from 'react'

import type { PackageSource } from '@mntn-dev/domain-types'
import type { PackageServiceWithAcl } from '@mntn-dev/project-service'
import { createContext } from '@mntn-dev/ui-components'

import type { PackageServiceLike } from '~/lib/package-services/index.ts'

export function usePackageBrowser({
  existingPackageServices,
  pendingPackageServices,
  allPackageServices,
  showCreditToggle,
  packageSource,
  onAdd,
  onBack,
  onCancel,
  onRemove,
  onSubmitPendingServices,
  loading,
  costMarginPercent,
}: {
  existingPackageServices: PackageServiceLike[]
  pendingPackageServices: Array<PackageServiceWithAcl>
  allPackageServices: Array<PackageServiceWithAcl>
  showCreditToggle: boolean
  packageSource?: PackageSource
  onAdd: (service: PackageServiceWithAcl) => void
  onBack: () => void
  onCancel: () => void
  onRemove: (packageServiceIndex: number) => void
  onSubmitPendingServices: () => void
  loading: boolean
  costMarginPercent: number
}) {
  const [isCanceling, setIsCanceling] = useState(false)
  const [showCredits, setShowCredits] = useState(showCreditToggle)
  const toggleShowCredits = () => setShowCredits((prev) => !prev)

  const handleCancel = () => {
    if (pendingPackageServices.length === 0) {
      onBack()
    } else {
      setIsCanceling(true)
    }
  }

  return {
    isCanceling,
    setIsCanceling,
    showCredits,
    setShowCredits,
    toggleShowCredits,
    handleCancel,
    existingPackageServices,
    pendingPackageServices,
    allPackageServices,
    packageSource,
    onAdd,
    onBack,
    onCancel,
    onRemove,
    onSubmitPendingServices,
    loading,
    costMarginPercent,
  }
}

export const [PackageBrowserProvider, usePackageBrowserContext] = createContext<
  ReturnType<typeof usePackageBrowser>
>({
  name: 'PackageBrowserContext',
})
