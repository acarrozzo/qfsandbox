import { projectTagCategories } from '@mntn-dev/app-common'
import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import {
  type BillingSchedule,
  BillingSchedules,
  hasMultipleTeams,
  type InvoiceTerms,
  InvoiceTermsMap,
  TeamId,
} from '@mntn-dev/domain-types'
import {
  Controller,
  type ControllerRenderProps,
  type FieldErrors,
  type GlobalError,
  useFormContext,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { DatePicker, Form, FormField, Select } from '@mntn-dev/ui-components'
import { addHours, first, isAfter } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { ProjectFileManagerLauncher } from '~/components/files/project-file-manager-launcher.tsx'
import { MyOrganizationTeamSelect } from '~/components/team/team-select.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'
import { extractDate, getDateTimeString } from '~/utils/date-helpers.ts'

import { ProjectTagFormControl } from './project-tag-form-control.tsx'

type Props = {
  project: ProjectWithAcl
  onProjectUpdate: (updates: ProjectDetailsUpdateFormModel) => void
}

export const ProjectInfoBoxEdit = ({ project, onProjectUpdate }: Props) => {
  const { me } = useMe()
  const { t } = useTranslation(['project-details', 'project-form'])
  const { hasPermission } = usePermissions()

  const {
    control,
    formState: { isSubmitted, errors },
    trigger,
    getValues,
    setValue,
  } = useFormContext<ProjectDetailsUpdateFormModel>()

  const { dueDate, biddingCloseDate, projectId } = project || {}

  const [discoveredTags] = trpcReactClient.tags.discover.useSuspenseQuery({
    category: projectTagCategories,
  })

  const handleDueDateChange =
    (field: ControllerRenderProps<ProjectDetailsUpdateFormModel, 'dueDate'>) =>
    async (date: Date | null) => {
      field.onChange(date)
      if (!isSubmitted || (await trigger('dueDate'))) {
        onProjectUpdate({
          dueDate: date,
        })
      }
    }

  const handleBiddingEndDateChange =
    (
      field: ControllerRenderProps<
        ProjectDetailsUpdateFormModel,
        'biddingCloseDate'
      >
    ) =>
    async (newDate: Date | null) => {
      if (newDate) {
        newDate.setHours(17, 0, 0, 0) // 5:00 PM local time

        const minimumDueDate = addHours(newDate, 24)
        const dueDate = getValues('dueDate')

        if (dueDate && isAfter(minimumDueDate, dueDate)) {
          setValue('dueDate', minimumDueDate)
          onProjectUpdate({
            dueDate: minimumDueDate,
          })
        }
      }

      field.onChange(newDate)
      if (!isSubmitted || (await trigger('biddingCloseDate'))) {
        onProjectUpdate({
          biddingCloseDate: newDate,
        })
      }
    }

  const handleTeamChange = () => {
    // TODO: Implement team change
  }

  const biddingEndDate = getValues('biddingCloseDate')

  const getMinimumBiddingCloseDate = () => {
    const now = new Date()
    const isAfterCloseOfBusiness = isAfter(
      now,
      new Date().setHours(17, 0, 0, 0)
    )

    if (isAfterCloseOfBusiness) {
      return addHours(now, 96)
    }

    return addHours(now, 72)
  }

  const getRootError = (
    errors: FieldErrors<ProjectDetailsUpdateFormModel>
  ): GlobalError | undefined =>
    (errors as FieldErrors<Record<string, unknown>>)[''] as unknown as
      | GlobalError
      | undefined

  return (
    <Form.Layout className="w-full self-stretch grid-rows-[auto_auto_1fr]">
      <FormField hasError={!!errors.biddingCloseDate} columnSpan={3}>
        <FormField.Label>
          {t('project-form:bidding-close-date')}
        </FormField.Label>
        <Controller
          name="biddingCloseDate"
          control={control}
          defaultValue={biddingCloseDate}
          render={({ field }) => (
            <DatePicker
              {...field}
              minDate={getMinimumBiddingCloseDate()}
              showTime
              selected={field.value}
              value={field.value ? getDateTimeString(field.value) : undefined}
              onChange={handleBiddingEndDateChange(field)}
              dataTestId="project-bidding-close-date-picker"
              dataTrackingId="project-bidding-close-date-picker"
            />
          )}
        />
        <FormField.Error>{errors.biddingCloseDate?.message}</FormField.Error>
      </FormField>
      <FormField
        hasError={!!errors.dueDate || !!getRootError(errors)}
        columnSpan={3}
      >
        <FormField.Label>{t('project-form:due-date')}</FormField.Label>
        <Controller
          name="dueDate"
          control={control}
          defaultValue={dueDate}
          rules={{
            required: t('due-date-required-error', { ns: 'project-form' }),
          }}
          render={({ field }) => (
            <DatePicker
              {...field}
              minDate={addHours(
                biddingEndDate ?? getMinimumBiddingCloseDate(),
                24
              )}
              selected={field.value}
              value={field.value ? extractDate(field.value) : undefined}
              onChange={handleDueDateChange(field)}
              dataTestId="project-due-date-picker"
              dataTrackingId="project-due-date-picker"
            />
          )}
        />
        <FormField.Error>
          {errors.dueDate?.message ?? getRootError(errors)?.message}
        </FormField.Error>
      </FormField>

      {projectTagCategories.map((category) => (
        <ProjectTagFormControl
          key={category}
          category={category}
          project={project}
          discoveredTags={discoveredTags}
        />
      ))}

      {hasPermission('project:administer') && (
        <>
          <FormField columnSpan={3}>
            <FormField.Label>
              {t('project-details:payment-option')}
            </FormField.Label>
            <Controller
              name="invoiceTerms"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue={field.value}
                  placeholder={t('project-details:payment-option')}
                  onChange={(value: InvoiceTerms) => {
                    onProjectUpdate({ invoiceTerms: value })
                    field.onChange(value)
                  }}
                  searchable={false}
                  deselectable={false}
                  options={Object.values(InvoiceTermsMap).map(
                    (term: InvoiceTerms) => ({
                      value: term,
                      label: t(`project-details:payment_terms.${term}`),
                    })
                  )}
                />
              )}
            />
            <FormField.Error>{errors.invoiceTerms?.message}</FormField.Error>
          </FormField>
          <FormField columnSpan={3}>
            <FormField.Label>
              {t('project-details:invoice-payment-terms')}
            </FormField.Label>
            <Controller
              name="billingSchedule"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue={field.value}
                  placeholder={t('project-details:invoice-payment-terms')}
                  onChange={(value: BillingSchedule) => {
                    onProjectUpdate({ billingSchedule: value })
                    field.onChange(value)
                  }}
                  searchable={false}
                  deselectable={false}
                  options={Object.values(BillingSchedules).map(
                    (schedule: BillingSchedule) => ({
                      value: schedule,
                      label: t(`project-details:billing_schedules.${schedule}`),
                    })
                  )}
                />
              )}
            />
            <FormField.Error>{errors.billingSchedule?.message}</FormField.Error>
          </FormField>
        </>
      )}

      {hasMultipleTeams(me) && (
        <FormField columnSpan={3}>
          <FormField.Label>{t('project-form:team')}</FormField.Label>
          <MyOrganizationTeamSelect
            disabled={true}
            onChange={handleTeamChange}
            value={first(me.teams)?.teamId ?? TeamId.Empty}
          />
        </FormField>
      )}
      <FormField columnSpan={3}>
        <FormField.Label>{t('add-reference-files')}</FormField.Label>
        <ProjectFileManagerLauncher
          projectId={projectId}
          className="w-full"
          dataTestId="project-details-file-manager-button"
          dataTrackingId="project-details-file-manager-button"
        />
      </FormField>
    </Form.Layout>
  )
}
