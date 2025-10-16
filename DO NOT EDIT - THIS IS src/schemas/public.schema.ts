import type { TFunction } from 'i18next'

import {
  type EmailAddress,
  EmailAddressSchema,
  type Name,
  NameSchema,
} from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const UniqueUserEmailAddressSchemaBuilder = ({
  t,
  field,
  ignoreEmail,
}: {
  t: TFunction<['validation']>
  field: string
  ignoreEmail?: EmailAddress
}) => {
  const trpcClient = trpcReactClient.useUtils().client

  return EmailAddressSchema.refine(
    async (value) => {
      return (
        value === ignoreEmail ||
        (EmailAddressSchema.safeParse(value).success &&
          !(await trpcClient.public.userEmailExists.query(value)))
      )
    },
    {
      message: t('validation:field.field-in-use', {
        field,
      }),
    }
  )
}

export const UniqueOrganizationNameSchemaBuilder = ({
  t,
  field,
  ignoreName,
}: {
  t: TFunction<['validation']>
  field: string
  ignoreName?: Name
}) => {
  const trpcClient = trpcReactClient.useUtils().client

  return NameSchema.refine(
    async (value) => {
      return (
        value === ignoreName ||
        (NameSchema.safeParse(value).success &&
          !(await trpcClient.public.organizationNameExists.query(value)))
      )
    },
    {
      message: t('validation:field.field-in-use', {
        field,
      }),
    }
  )
}

export const UniqueTeamNameSchemaBuilder = ({
  t,
  field,
  ignoreName,
}: {
  t: TFunction<['validation']>
  field: string
  ignoreName?: Name
}) => {
  const trpcClient = trpcReactClient.useUtils().client

  return NameSchema.refine(
    async (value) => {
      return (
        value === ignoreName ||
        (NameSchema.safeParse(value).success &&
          !(await trpcClient.public.teamNameExists.query(value)))
      )
    },
    {
      message: t('validation:field.field-in-use', {
        field,
      }),
    }
  )
}
