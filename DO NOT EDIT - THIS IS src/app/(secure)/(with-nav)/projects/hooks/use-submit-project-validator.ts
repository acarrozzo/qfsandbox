import { serviceWithDeliverables } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import { useToast } from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import {
  isCustomServiceMissingBrandNote,
  isNonIncludedService,
} from '~/lib/services/service-helpers.ts'

/**
 * This is a custom hook that provides *extra* validation and runs side effects in case the validation fails.
 * Generally, form validation should be done within the form components connected to the react-hook-form.
 * However, in some cases like an acl check or brand note we want to do some higher level validation that is
 * not strictly tied to the react-hook-form engine (components that are not a part of that form).
 *
 * @returns true or false to indicate if the validation passed and the form should be allowed to submit.
 */
export const useSubmitProjectValidator = () => {
  const { t } = useTranslation(['toast'])
  const { showToast } = useToast()

  const validate = (
    project: ProjectWithAcl,
    services: ProjectServiceWithAcl[]
  ) => {
    if (!project.acl.canSubmitProject) {
      return false
    }

    if (!services.some(serviceWithDeliverables)) {
      showToast.error({
        title: t('toast:project.missing-deliverable.title'),
        body: t('toast:project.missing-deliverable.body'),
        dataTestId: 'project-missing-deliverable-error-toast',
        dataTrackingId: 'project-missing-deliverable-error-toast',
      })

      return false
    }

    if (project.inherited.package.cost <= 0) {
      if (isNonEmptyArray(services) && !services.some(isNonIncludedService)) {
        showToast.error({
          title: t('toast:project.missing-services.title'),
          body: t('toast:project.missing-services.body'),
          dataTestId: 'project-missing-services-error-toast',
          dataTrackingId: 'project-missing-services-error-toast',
        })
        return false
      }

      if (
        services.reduce(
          (acc, service) => acc + (service.costPlusMargin ?? 0),
          0
        ) <= 0
      ) {
        showToast.error({
          title: t('toast:project.missing-cost.title'),
          body: t('toast:project.missing-cost.body'),
          dataTestId: 'project-missing-cost-error-toast',
          dataTrackingId: 'project-missing-cost-error-toast',
        })
        return false
      }
    }

    const serviceMissingBrandNote = services.find(
      isCustomServiceMissingBrandNote
    )

    if (serviceMissingBrandNote) {
      showToast.error({
        title: t('toast:project.missing-brand-note.title'),
        body: t('toast:project.missing-brand-note.body', {
          name: serviceMissingBrandNote.name,
        }),
        dataTestId: 'project-missing-brand-note-error-toast',
        dataTrackingId: 'project-missing-brand-note-error-toast',
      })

      return false
    }

    return true
  }

  return { validate }
}
