import { useTranslation } from '@mntn-dev/i18n'
import {
  getChildTestProps,
  RichText,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'

import { useTeamProfileEditorContext } from '../../../../hooks/use-team-profile-editor.ts'

const TeamOverview = () => {
  const {
    dataTestId,
    dataTrackingId,
    editing,
    form: { control, getValues },
  } = useTeamProfileEditorContext()

  const { field } = useEditorController({
    control,
    name: 'profile.overview',
  })

  const { t } = useTranslation('team-profile')

  const overview = getValues('profile.overview')

  if (!(overview || editing)) {
    return null
  }

  return (
    <div className="w-full max-w-4xl">
      {editing ? (
        <TextEditor
          ref={field.ref}
          onBlur={field.onBlur}
          onChange={field.onChange}
          defaultValue={field.value}
          placeholder={t('overview.placeholder')}
          className="h-50"
          {...getChildTestProps(
            { dataTestId, dataTrackingId },
            'overview',
            'textarea'
          )}
        />
      ) : (
        <RichText
          bounded
          value={overview}
          className="w-full max-h-50"
          {...getChildTestProps({ dataTestId, dataTrackingId }, 'overview')}
        />
      )}
    </div>
  )
}

export { TeamOverview }
