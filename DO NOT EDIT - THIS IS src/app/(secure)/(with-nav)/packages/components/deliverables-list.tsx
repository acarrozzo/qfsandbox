import type { SetOptional } from 'type-fest'

import type { DeliverableDetails } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Blade,
  BladeList,
  Heading,
  Stack,
  Tag,
  Text,
} from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { deriveTokenizedDeliverableName } from '~/lib/deliverables/deliverable-helpers.ts'

type DeliverableBladeProps = {
  deliverable: DeliverableDetails
  onClick?: () => void
}

const DeliverableBlade = ({ deliverable, onClick }: DeliverableBladeProps) => {
  const { t } = useTranslation('deliverable')

  const tokenizedDeliverableName = deriveTokenizedDeliverableName({
    deliverable,
    t,
  })

  if (!isNonEmptyArray(tokenizedDeliverableName)) {
    return null
  }

  const [category, ...tokens] = tokenizedDeliverableName

  return (
    <Blade type="mini" onClick={onClick}>
      <Blade.Column grow>
        <Text fontSize="base">{category}</Text>
      </Blade.Column>
      <Blade.Column>
        <Stack direction="row" gap="2">
          {tokens.map((token) => (
            <Tag key={token} variant="secondary">
              {token}
            </Tag>
          ))}
        </Stack>
      </Blade.Column>
    </Blade>
  )
}

type DeliverablesListProps = {
  deliverables: Array<DeliverableDetails>
  onClick?: (index: number) => void
}

export const DeliverablesList = ({
  deliverables,
  onClick,
}: SetOptional<DeliverablesListProps, 'deliverables'>) => {
  const { t } = useTranslation('deliverable-list')

  return (
    <Stack direction="col" gap="4">
      <Heading fontSize="xl">{t('title')}</Heading>
      {deliverables && deliverables.length > 0 ? (
        <BladeList>
          {deliverables.map((deliverable, i) => (
            <DeliverableBlade
              key={`${deliverable.category}_${i}`}
              deliverable={deliverable}
              onClick={onClick ? () => onClick(i) : undefined}
            />
          ))}
        </BladeList>
      ) : (
        <Text
          className="h-full content-center text-center"
          as="div"
          textColor="tertiary"
        >
          {t('empty.content')}
        </Text>
      )}
    </Stack>
  )
}
