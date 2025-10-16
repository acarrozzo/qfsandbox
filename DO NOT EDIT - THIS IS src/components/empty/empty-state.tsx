import type React from 'react'
import type { PropsWithChildren } from 'react'

import { useTranslation } from '@mntn-dev/i18n'
import {
  getTestProps,
  Stack,
  Surface,
  type SurfaceProps,
  Text,
} from '@mntn-dev/ui-components'
import { themeBackgroundMap } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

const testId = (id: string) => `${id}-empty-placeholder`

const SimpleMessage = ({ message }: { message: string }) => (
  <Text
    className="h-full content-center text-center"
    as="div"
    textColor="tertiary"
  >
    {message}
  </Text>
)

const NothingToSee = () => {
  const { t } = useTranslation('generic')

  return <SimpleMessage message={t('nothing-to-see')} />
}

const CallToAction = ({
  heading,
  button,
}: {
  heading: React.JSX.Element
  button?: React.JSX.Element
}) => {
  return (
    <Stack direction="col" gap="4" alignItems="center">
      <Stack direction="col" alignItems="center">
        {heading}
      </Stack>
      {button}
    </Stack>
  )
}

type EmptyStateProps = PropsWithChildren<SurfaceProps> & { id: string }

const EmptyStateComponent = ({
  id,
  children,
  className,
  ...props
}: EmptyStateProps) => {
  return (
    <Surface
      {...props}
      padding="20"
      width="full"
      height="full"
      {...getTestProps({
        dataTestId: testId(id),
        dataTrackingId: testId(id),
      })}
      className={cn(themeBackgroundMap['container-tertiary'], className)}
    >
      {children}
    </Surface>
  )
}

const EmptyStateNamespace = Object.assign(EmptyStateComponent, {
  SimpleMessage,
  NothingToSee,
  CallToAction,
})

export { EmptyStateNamespace as EmptyState }
