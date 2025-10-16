import { AppTrans } from '@mntn-dev/app-common'
import { Text } from '@mntn-dev/ui-components'

export type TeamTitle =
  | string
  | Pick<React.ComponentProps<typeof AppTrans>, 't' | 'i18nKey' | 'values'>

export const TeamListTitle = ({ title }: { title: TeamTitle }) => {
  if (typeof title === 'string') {
    return (
      <Text textColor="secondary" fontWeight="medium">
        {title}
      </Text>
    )
  }

  return (
    <Text textColor="secondary" fontWeight="medium">
      <AppTrans t={title.t} i18nKey={title.i18nKey} values={title.values} />
    </Text>
  )
}
