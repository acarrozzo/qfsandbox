'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import {
  isCreditProgramKind,
  isMNTNCreativeProgram,
} from '@mntn-dev/domain-types'
import type {
  PackageServiceWithAcl,
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'

import { ProjectPackageBrowser } from '#projects/components/services/project-package-browser.tsx'
import { usePendingPackageServices } from '#projects/components/services/use-pending-services.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefetchProject } from '~/components/projects/use-refetch-project.ts'
import { useRefetchProjectServices } from '~/components/services/use-refetch-project-services'
import type { PackageServiceLike } from '~/lib/package-services/index.ts'

export const ProjectServiceBrowser = ({
  initialProject,
  initialPackageServices,
  initialServices,
}: {
  initialProject: ProjectWithAcl
  initialPackageServices: Array<PackageServiceWithAcl>
  initialServices: Array<ProjectServiceWithAcl>
}) => {
  const router = useRouter()
  const { projectId } = initialProject
  const refetchProject = useRefetchProject()
  const refetchProjectServices = useRefetchProjectServices({ projectId })

  const projectQuery = trpcReactClient.projects.get.useQuery(projectId, {
    initialData: { project: initialProject },
  })
  const { project } = projectQuery.data

  const update = trpcReactClient.projects.update.useMutation()
  const addServicesToProject =
    trpcReactClient.projects.addServicesToProject.useMutation()
  const removeServiceFromProject =
    trpcReactClient.projects.removeServiceFromProject.useMutation()
  const { data: projectServices } =
    trpcReactClient.projects.getProjectServicesByProjectId.useQuery(projectId, {
      initialData: initialServices,
    })

  const loading =
    update.isPending ||
    addServicesToProject.isPending ||
    removeServiceFromProject.isPending

  const handleSubmitPendingServices = async () => {
    await addServicesToProject.mutateAsync({
      projectId,
      packageServiceIds: pending.packageServices.map(
        (packageService) => packageService.packageServiceId
      ),
    })

    await refetchProjectServices()
    await refetchProject(project)

    pending.clear()

    router.push(route('/projects/:projectId').params({ projectId }))
  }

  const handleBack = () => {
    router.backOrPush(route('/projects/:projectId').params({ projectId }))
  }

  const handleCancel = () => {
    pending.clear()
    handleBack()
  }

  const pending = usePendingPackageServices({
    projectId,
  })

  const addedPackageServices: PackageServiceLike[] = [
    ...pending.packageServices,
    ...projectServices,
  ]

  return (
    <ProjectPackageBrowser
      existingPackageServices={addedPackageServices}
      onAdd={pending.add}
      onBack={handleBack}
      onCancel={handleCancel}
      onRemove={pending.remove}
      pendingPackageServices={pending.packageServices}
      allPackageServices={initialPackageServices}
      loading={loading}
      onSubmitPendingServices={handleSubmitPendingServices}
      showCreditToggle={
        isCreditProgramKind(project.chosenBillingMethod) &&
        isMNTNCreativeProgram(project.chosenBillingMethod)
      }
      packageSource={project.package?.packageSource}
      costMarginPercent={project.costMarginPercent ?? 0}
    />
  )
}
