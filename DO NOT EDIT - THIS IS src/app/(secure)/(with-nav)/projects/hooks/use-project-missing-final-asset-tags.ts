import type {
  DeliverableDomainQueryModel,
  ProjectId,
} from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useProjectMissingFinalAssetTags = (
  projectId: ProjectId,
  _deliverables: DeliverableDomainQueryModel[]
) => {
  const { data: untaggedTaggableDeliverables = [] } =
    trpcReactClient.projects.getProjectUntaggedTaggableDeliverables.useQuery(
      projectId
    )

  return untaggedTaggableDeliverables.length > 0
}
