import { Fragment } from 'react'

import { useController } from '@mntn-dev/forms'
import {
  getChildTestIds,
  getChildTestProps,
  Icon,
  Text,
} from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { EmailMultivalue } from '~/components/form/email-multivalue.tsx'

import { useTeamProfileEditorContext } from '../../../../hooks/use-team-profile-editor.ts'

const EmailAddressesView = ({
  emailAddresses,
}: {
  emailAddresses?: string[]
}) => {
  const { dataTestId, dataTrackingId } = useTeamProfileEditorContext()

  if (isNonEmptyArray(emailAddresses)) {
    return (
      <div
        className="flex flex-wrap justify-center items-center gap-2"
        {...getChildTestProps(
          { dataTestId, dataTrackingId },
          'email-addresses-list'
        )}
      >
        <Icon name="mail" size="lg" color="brand" />
        {emailAddresses.map((emailAddress, index) => (
          <Fragment key={emailAddress}>
            <Text>{emailAddress}</Text>
            {index < emailAddresses.length - 1 && (
              <Text textColor="secondary">•</Text>
            )}
          </Fragment>
        ))}
      </div>
    )
  }

  return null
}

const EmailAddresses = () => {
  const {
    editing,
    form: { control },
    dataTestId,
    dataTrackingId,
  } = useTeamProfileEditorContext()
  const { field } = useController({
    control,
    name: 'profile.emailAddresses',
  })

  const handleChange = (emails: string[]) => {
    field.onChange(emails)
  }

  return (
    <div className="[grid-area:email-addresses]">
      {editing ? (
        <EmailMultivalue
          ref={field.ref}
          initialEmails={field.value}
          onChange={handleChange}
          onBlur={field.onBlur}
          {...getChildTestIds(
            { dataTestId, dataTrackingId },
            'email-addresses'
          )}
        />
      ) : (
        <EmailAddressesView emailAddresses={field.value} />
      )}
    </div>
  )
}

export { EmailAddresses }
