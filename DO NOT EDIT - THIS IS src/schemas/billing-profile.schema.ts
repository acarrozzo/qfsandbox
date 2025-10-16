import type { TFunction } from 'i18next'
import { z } from 'zod'

import {
  EmailAddressSchema,
  NameSchema,
  type OrganizationId,
} from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const UniqueBillingProfileEmailSchemaBuilder = ({
  t,
  field,
  organizationId,
}: {
  t: TFunction<['validation']>
  field: string
  organizationId: OrganizationId
}) => {
  const trpcClient = trpcReactClient.useUtils().client

  return EmailAddressSchema.superRefine(async (value, ctx) => {
    // Only check uniqueness if the email format is valid
    const emailValidation = EmailAddressSchema.safeParse(value)
    if (!emailValidation.success) {
      return // Let the base schema handle format validation
    }

    try {
      const isEmailInUse =
        await trpcClient.financeCoordinator.checkBillingProfileByContactEmail.query(
          {
            organizationId,
            emailAddress: value,
          }
        )

      if (isEmailInUse) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation:field.field-in-use', { field }),
        })
      }
    } catch (_error) {
      // When we can't check uniqueness due to network error, fail validation
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation:field.field-check-unavailable', { field }),
      })
    }
  })
}

export const UniqueBillingProfileNameSchemaBuilder = ({
  t,
  field,
  organizationId,
}: {
  t: TFunction<['validation']>
  field: string
  organizationId: OrganizationId
}) => {
  const trpcClient = trpcReactClient.useUtils().client

  return NameSchema.superRefine(async (value, ctx) => {
    // Only check uniqueness if the name format is valid
    const nameValidation = NameSchema.safeParse(value)
    if (!nameValidation.success) {
      return // Let the base schema handle format validation
    }

    try {
      const isNameInUse =
        await trpcClient.financeCoordinator.checkBillingProfileByName.query({
          organizationId,
          name: value,
        })

      if (isNameInUse) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation:field.field-in-use', { field }),
        })
      }
    } catch (_error) {
      // When we can't check uniqueness due to network error, fail validation
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation:field.field-check-unavailable', { field }),
      })
    }
  })
}
