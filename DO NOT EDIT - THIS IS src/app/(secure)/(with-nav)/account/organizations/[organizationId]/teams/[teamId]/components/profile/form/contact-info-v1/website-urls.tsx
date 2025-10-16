import { Fragment } from 'react'

import { useController } from '@mntn-dev/forms'
import {
  getChildTestIds,
  getChildTestProps,
  Icon,
  Text,
} from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { UrlMultivalue } from '~/components/form/url-multivalue.tsx'

import { useTeamProfileEditorContext } from '../../../../hooks/use-team-profile-editor.ts'

const WebsiteUrlsView = ({ websiteUrls }: { websiteUrls?: string[] }) => {
  const { dataTestId, dataTrackingId } = useTeamProfileEditorContext()

  if (isNonEmptyArray(websiteUrls)) {
    return (
      <div
        className="flex flex-wrap justify-center items-center gap-2"
        {...getChildTestProps(
          { dataTestId, dataTrackingId },
          'website-urls-list'
        )}
      >
        <Icon name="global" size="lg" color="brand" />
        {websiteUrls.map((websiteUrl, index) => (
          <Fragment key={websiteUrl}>
            <Text>{websiteUrl}</Text>
            {index < websiteUrls.length - 1 && (
              <Text textColor="secondary">•</Text>
            )}
          </Fragment>
        ))}
      </div>
    )
  }

  return null
}

const WebsiteUrls = () => {
  const {
    dataTestId,
    dataTrackingId,
    editing,
    form: { control },
  } = useTeamProfileEditorContext()
  const { field } = useController({
    control,
    name: 'profile.websiteUrls',
  })

  return editing ? (
    <UrlMultivalue
      ref={field.ref}
      initialUrls={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      {...getChildTestIds({ dataTestId, dataTrackingId }, 'website-urls')}
    />
  ) : (
    <WebsiteUrlsView websiteUrls={field.value} />
  )
}

export { WebsiteUrls }
