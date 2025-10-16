import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import {
  Avatar,
  type AvatarPersonProps,
  type TestIds,
} from '@mntn-dev/ui-components'

import { usePersonImageUrlInterceptor } from '~/components/avatar/use-person-image-url-interceptor.tsx'

export const AvatarInterceptor = (
  props: TestIds & Pick<AvatarPersonProps, 'person' | 'loading'>
) => {
  const { person: originalPerson, loading } = props
  const { person } = usePersonImageUrlInterceptor(originalPerson, {
    height: 116,
    width: 116,
  })

  return (
    <Avatar.Person
      person={person}
      image={NextImage({ unoptimized: true })}
      loading={loading}
    />
  )
}
