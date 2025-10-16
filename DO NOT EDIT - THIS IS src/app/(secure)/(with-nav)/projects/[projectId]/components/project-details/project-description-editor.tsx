import { useRef } from 'react'

import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import { DescriptionFieldModal } from '@mntn-dev/app-ui-components/description-field-modal'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import {
  Button,
  FieldModal,
  FormField,
  getTestProps,
  RichText,
  Stack,
  TextEditor,
  useEditorController,
  useOpenState,
} from '@mntn-dev/ui-components'
import { mergeRefs } from '@mntn-dev/utilities'

import { ProjectDescriptionTooltip } from '#projects/[projectId]/components/project-details/project-description-tooltip.tsx'

type ProjectDescriptionProps = Readonly<{
  onProjectUpdate: (updates: ProjectDetailsUpdateFormModel) => void
  project: ProjectWithAcl
}>

export const ProjectDescriptionEditor = ({
  onProjectUpdate,
  project,
}: ProjectDescriptionProps) => {
  const { t } = useTranslation(['generic', 'project-form', 'project-details'])

  const innerRef = useRef<HTMLDivElement>(null)

  const { onClose, onToggle, open } = useOpenState()

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
  } = useFormContext<ProjectDetailsUpdateFormModel>()

  const { field } = useEditorController({
    control,
    name: 'description',
  })

  const handleSave = async () => {
    const success = await trigger('description')

    if (success) {
      const description = getValues('description')

      onProjectUpdate({ description })
      onClose()
    }
  }

  const editorRef = mergeRefs(innerRef, field.ref)

  return (
    <>
      <FormField hasError={!!errors.description} columnSpan={6}>
        <FormField.Label>
          {t('project-description', { ns: 'project-details' })}
        </FormField.Label>
        <button
          type="button"
          {...getTestProps({
            dataTestId: 'project-description-button',
            dataTrackingId: 'project-description-button',
          })}
          className="h-full w-full"
          onClick={onToggle}
        >
          <FormField.Surface
            border
            className="flex flex-1 cursor-pointer text-left"
            height="full"
            padding="6"
          >
            <RichText value={project.description} bounded />
          </FormField.Surface>
        </button>
        <FormField.Error>{errors.description?.message}</FormField.Error>
      </FormField>
      <DescriptionFieldModal open={open} onClose={onClose}>
        <FieldModal.Title>
          {t('project-description', { ns: 'project-details' })}
        </FieldModal.Title>
        <FieldModal.Main>
          <FieldModal.Controls>
            <FormField className="h-full" hasError={!!errors.description}>
              <FormField.Label>
                <Stack gap="2" justifyContent="center" alignItems="center">
                  {t('project-description-label', { ns: 'project-details' })}
                  <ProjectDescriptionTooltip />
                </Stack>
              </FormField.Label>
              <TextEditor
                ref={editorRef}
                defaultValue={field.value}
                placeholder={t('project-description-placeholder', {
                  ns: 'project-details',
                })}
                form="project-form"
                onChange={field.onChange}
                onBlur={field.onBlur}
                autofocus
                dataTestId="project-description-textbox"
                dataTrackingId="project-description-textbox"
                className="h-full"
              />
              <FormField.Error>{errors.description?.message}</FormField.Error>
            </FormField>
          </FieldModal.Controls>
          <FieldModal.Buttons>
            <Button onClick={handleSave}>
              {t('save-and-close', { ns: 'generic' })}
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t('cancel', { ns: 'generic' })}
            </Button>
          </FieldModal.Buttons>
        </FieldModal.Main>
      </DescriptionFieldModal>
    </>
  )
}
