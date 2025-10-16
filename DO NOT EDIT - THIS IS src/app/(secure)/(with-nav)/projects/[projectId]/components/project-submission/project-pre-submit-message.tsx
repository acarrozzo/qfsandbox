import type { TFunction } from 'i18next'

import { useTranslation } from '@mntn-dev/i18n'
import { type IconProps, Stack, Text } from '@mntn-dev/ui-components'

const getPreSubmitMessage = (
  t: TFunction<'project-form'>
): { message: string; iconColor: IconProps['color'] } => {
  return {
    message: t('pre-submit-message-bidding', { ns: 'project-form' }),
    iconColor: 'info',
  }
}

export const ProjectPreSubmitMessage = () => {
  const { t } = useTranslation(['project-form'])

  const { message } = getPreSubmitMessage(t)

  return (
    <Stack direction="row" gap="2">
      <Text>{message}</Text>
    </Stack>
  )
}
