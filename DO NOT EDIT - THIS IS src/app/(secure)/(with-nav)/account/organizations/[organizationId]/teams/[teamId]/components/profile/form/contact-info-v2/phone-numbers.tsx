import { Fragment } from 'react'

import { useController } from '@mntn-dev/forms'
import {
  getChildTestIds,
  getChildTestProps,
  Icon,
  type PhoneInputRef,
  parsePhoneNumber,
  Text,
} from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { PhoneMultivalue } from '~/components/form/phone-multivalue.tsx'

import { useTeamProfileEditorContext } from '../../../../hooks/use-team-profile-editor.ts'

const PhoneNumbersView = ({ phoneNumbers }: { phoneNumbers?: string[] }) => {
  const { dataTestId, dataTrackingId } = useTeamProfileEditorContext()

  const { region } = new Intl.Locale(navigator.language)

  if (isNonEmptyArray(phoneNumbers)) {
    return (
      <div
        className="flex flex-wrap justify-center items-center gap-2"
        {...getChildTestProps(
          { dataTestId, dataTrackingId },
          'phone-numbers-list'
        )}
      >
        <Icon name="phone" size="lg" color="brand" />
        {phoneNumbers.map((phoneNumber, index) => {
          const parsedNumber = parsePhoneNumber(phoneNumber, {
            regionCode: region,
          })

          const formattedPhoneNumber = parsedNumber.valid
            ? parsedNumber.number.national
            : phoneNumber
          return (
            <Fragment key={phoneNumber}>
              <Text>{formattedPhoneNumber}</Text>
              {index < phoneNumbers.length - 1 && (
                <Text textColor="secondary">•</Text>
              )}
            </Fragment>
          )
        })}
      </div>
    )
  }

  return null
}

const PhoneNumbers = () => {
  const {
    dataTestId,
    dataTrackingId,
    editing,
    form: { control },
  } = useTeamProfileEditorContext()
  const { field } = useController({
    control,
    name: 'profile.phoneNumbers',
  })

  const phoneRef = (el: PhoneInputRef | null) => {
    if (el) {
      field.ref(el.inputRef)
    }
  }

  return (
    <div className="[grid-area:phone-numbers]">
      {editing ? (
        <PhoneMultivalue
          ref={phoneRef}
          initialPhoneNumbers={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          {...getChildTestIds({ dataTestId, dataTrackingId }, 'phone-numbers')}
        />
      ) : (
        <PhoneNumbersView phoneNumbers={field.value} />
      )}
    </div>
  )
}

export { PhoneNumbers }
