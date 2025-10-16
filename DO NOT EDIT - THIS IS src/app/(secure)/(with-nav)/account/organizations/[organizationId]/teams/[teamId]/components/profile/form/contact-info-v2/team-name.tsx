import {
  FormField,
  getChildTestProps,
  Heading,
  Input,
} from '@mntn-dev/ui-components'

import { useTeamProfileEditorContext } from '../../../../hooks/use-team-profile-editor.ts'

const TeamName = () => {
  const {
    dataTestId,
    dataTrackingId,
    editing,
    form: {
      getValues,
      register,
      formState: { errors },
    },
  } = useTeamProfileEditorContext()

  return editing ? (
    <FormField hasError={!!errors.name} columnSpan={6}>
      <FormField.Control>
        <Input
          {...register('name')}
          {...getChildTestProps(
            { dataTestId, dataTrackingId },
            'name',
            'input'
          )}
          className="w-[480px]"
        />
      </FormField.Control>
      <FormField.Error>{errors.name?.message}</FormField.Error>
    </FormField>
  ) : (
    <Heading {...getChildTestProps({ dataTestId, dataTrackingId }, 'name')}>
      {getValues('name')}
    </Heading>
  )
}

export { TeamName }
