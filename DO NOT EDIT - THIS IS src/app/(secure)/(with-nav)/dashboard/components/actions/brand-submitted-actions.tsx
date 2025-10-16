import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectCardActionsComponentProps } from '@mntn-dev/app-ui-components/project-highlight-card'
import { Button, CurrencyContainer } from '@mntn-dev/ui-components'

import { useCurrency } from '~/utils/use-currency.ts'

export const BrandSubmittedActions = ({
  project,
  bid,
}: ProjectCardActionsComponentProps) => {
  const router = useRouter()
  const { currency } = useCurrency()

  const handleClick = () => {
    router.push(
      route('/projects/:projectId').params({
        projectId: project.projectId,
      })
    )
  }
  return (
    <div className="flex flex-col gap-6">
      {bid?.amount && (
        <CurrencyContainer
          currency={currency(bid.amount)}
          label={{ text: 'Bid' }}
        />
      )}
      <Button variant="secondary" iconRight="arrow-right" onClick={handleClick}>
        View Project
      </Button>
    </div>
  )
}
