import {
  NavigationAvatarItem,
  type NavigationAvatarItemProps,
} from '@mntn-dev/ui-components'

import { usePersonImageUrlInterceptor } from '~/components/avatar/use-person-image-url-interceptor.tsx'

export const NavigationAvatarInterceptor = (
  props: NavigationAvatarItemProps
) => {
  const { person: originalPerson, image, ...avatarProps } = props
  const { person } = usePersonImageUrlInterceptor(originalPerson, {
    width: 116,
    height: 116,
  })

  return <NavigationAvatarItem {...{ ...avatarProps, person, image }} />
}
