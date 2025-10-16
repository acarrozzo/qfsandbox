import type { ProjectId } from '@mntn-dev/domain-types'
import type { PackageServiceWithAcl } from '@mntn-dev/project-service'
import { useSessionStorage } from '@mntn-dev/ui-utilities'

export const usePendingPackageServices = ({
  projectId,
}: {
  projectId: ProjectId
}): {
  packageServices: Array<PackageServiceWithAcl>
  add: (packageService: PackageServiceWithAcl) => void
  clear: () => void
  remove: (packageServiceIndex: number) => void
} => {
  const [packageServices, setPackageServices] = useSessionStorage<
    Array<PackageServiceWithAcl>
  >(`package-browser-${projectId}-pending`, [], {
    initializeWithValue: false,
  })

  return {
    packageServices,
    add: (packageService: PackageServiceWithAcl) =>
      setPackageServices([...packageServices, packageService]),
    clear: () => setPackageServices([]),
    remove: (packageServiceIndex: number) =>
      setPackageServices(
        packageServices.filter((_, index) => index !== packageServiceIndex)
      ),
  }
}
