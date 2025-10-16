'use client'

import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import {
  isCustomService,
  type ProjectDomainQueryModel,
  type ProjectServiceDomainQueryModel,
} from '@mntn-dev/domain-types'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  FooterContentButton,
  FooterContentMessage,
  Stack,
} from '@mntn-dev/ui-components'

import { ProjectMinimumPriceWithToggle } from '#projects/[projectId]/components/project-minimum-price-with-toggle.tsx'
import { isFormInvalid } from '~/utils/form'

import { ProjectFooterLayout } from '../project-footer-layout.tsx'
import { BrandProjectDraftFooterNotice } from './components/brand-project-draft-footer-notice.tsx'

type Props = {
  formId?: string
  project: ProjectDomainQueryModel
  projectServices: ProjectServiceDomainQueryModel[]
}

export const BrandProjectDraftFooter = ({
  formId,
  project,
  projectServices,
}: Props) => {
  const { t } = useTranslation([
    'generic',
    'pricing',
    'project-details',
    'project-footer',
    'validation',
  ])

  const {
    formState: { isSubmitting, errors },
  } = useFormContext<ProjectDetailsUpdateFormModel>()

  const customServices = projectServices.filter(isCustomService)

  return (
    <div className="min-h-32 flex items-center">
      <ProjectFooterLayout
        left={
          <BrandProjectDraftFooterNotice
            customServiceCount={customServices.length}
          />
        }
        right={
          <>
            <ProjectMinimumPriceWithToggle
              project={project}
              priceContext="brand"
              customServiceCount={customServices.length}
            />

            <Stack direction="col" gap="4">
              <FooterContentButton
                form={formId}
                type="submit"
                disabled={isSubmitting}
              >
                {t('review-project', { ns: 'project-details' })}
              </FooterContentButton>

              {isFormInvalid(errors) && (
                <FooterContentMessage
                  message={
                    // TODO: We need a better solution around orphaned message vs summary priority. react-hook-form doesn't do validation summary handling well.
                    // So we either need to have:
                    // 1. A separate area for orphaned messages (E.g., somewhere else in the project details that can enumerate all the orphaned messages)
                    // 2. Not have orphaned messages (e.g., red box and message below services content area)
                    // 3. Or build a more robust validation summary handling system that can reconcile orphaned messages with summary messages.
                    t('summary', { ns: 'validation' })
                  }
                  textColor="negative"
                />
              )}
            </Stack>
          </>
        }
      />
    </div>
  )
}
