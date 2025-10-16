'use client'

import { z } from 'zod'

import { AppTrans } from '@mntn-dev/app-common'
import { UrlNormalizerSchema } from '@mntn-dev/app-form-schemas'
import { useCookieParams } from '@mntn-dev/app-navigation/client'
import { mapRegistrationTypeToOrganizationType } from '@mntn-dev/app-routing'
import {
  OrganizationSignUpModelSchema,
  type SignUpModel,
  SignUpModelSchema,
  UserSignUpModelSchema,
} from '@mntn-dev/domain-types'
import { Controller, useForm, zodResolver } from '@mntn-dev/forms'
import { NarrowTFunction, useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Checkbox,
  Form,
  FormField,
  Heading,
  Icon,
  Input,
  Link,
  RadioGroup,
  Stack,
  Text,
} from '@mntn-dev/ui-components'
import { normalizeUrlString } from '@mntn-dev/utilities'

import { useUnauthenticatedSession } from '~/hooks/secure/use-unauthenticated-session.ts'
import {
  UniqueOrganizationNameSchemaBuilder,
  UniqueUserEmailAddressSchemaBuilder,
} from '~/schemas/public.schema.ts'

import { useSignUpAgreement } from '../hooks/use-sign-up-agreement.ts'

type SignUpFormProps = {
  isSaving: boolean
  onSubmit: (registration: SignUpModel) => Promise<void>
}

export const SignUpForm = ({
  isSaving,
  onSubmit: onSubmitProp,
}: SignUpFormProps) => {
  const { t } = useTranslation(['account-registration', 'validation'])
  const { t: tValidation } = useTranslation('validation')
  const { authn } = useUnauthenticatedSession()

  const { __type = 'video-professional' } = useCookieParams()
  const organizationType = mapRegistrationTypeToOrganizationType[__type]

  const onSubmit = async (registration: SignUpModel) => {
    const url = registration.organization.websiteUrl

    await onSubmitProp({
      ...registration,
      organization: {
        ...registration.organization,
        websiteUrl:
          typeof url === 'string' ? normalizeUrlString(url) : undefined,
      },
    })
  }

  const methods = useForm({
    reValidateMode: 'onSubmit', // The default onChange is a bad experience because the latency involved with server-side validation.
    defaultValues: {
      user: {
        firstName: authn?.claims?.first_name,
        lastName: authn?.claims?.last_name,
        emailAddress: authn?.claims?.primary_email,
      },
      organization: {
        name: '',
        organizationType,
        websiteUrl: '',
      },
      agreementCheck: false,
    },
    resolver: zodResolver(
      SignUpModelSchema.extend({
        user: UserSignUpModelSchema.extend({
          emailAddress: UniqueUserEmailAddressSchemaBuilder({
            t: NarrowTFunction<['validation']>(t),
            field: t('account-registration:form.field.user.emailAddress'),
          }),
        }),
        organization: OrganizationSignUpModelSchema.extend({
          name: UniqueOrganizationNameSchemaBuilder({
            t: NarrowTFunction<['validation']>(t),
            field: t('account-registration:form.field.organization.name'),
          }),
          websiteUrl: UrlNormalizerSchema,
        }),
        agreementCheck: z.literal(true),
      }),
      tValidation,
      {},
      { mode: 'async' }
    ),
  })

  const {
    handleSubmit,
    formState: { errors, isValidating },
    register,
    control,
    watch,
  } = methods

  const watchedOrganizationType = watch('organization.organizationType')

  const agreement = useSignUpAgreement({
    organizationType: watchedOrganizationType,
  })

  const isLoading = isSaving || isValidating
  const isDisabled = isLoading

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      id="package-service-modal"
      className="h-full w-192 gap-8"
      gap="gap-8"
    >
      <Stack gap="4" direction="col">
        <Icon size="3xl" name="team" className="m-auto" color="brand" />
        <Heading fontSize="2xl">{t('account-registration:form.title')}</Heading>
        <Text fontSize="sm" textColor="secondary">
          {t('account-registration:form.subtitle')}
        </Text>
      </Stack>

      <Stack className="text-left">
        <Controller
          name="organization.organizationType"
          control={control}
          disabled={isDisabled}
          render={({ field }) => (
            <RadioGroup {...field}>
              <RadioGroup.Item
                dataTestId="account-registration-organization-type-brand-radio"
                dataTrackingId="account-registration-organization-type-brand-radio"
                className="w-1/2"
                value="brand"
                title={t(
                  'account-registration:form.organizationType.brand.title'
                )}
                subtitle={t(
                  'account-registration:form.organizationType.brand.subtitle'
                )}
              />
              <RadioGroup.Item
                dataTestId="account-registration-organization-type-agency-radio"
                dataTrackingId="account-registration-organization-type-agency-radio"
                className="w-1/2"
                value="agency"
                title={t(
                  'account-registration:form.organizationType.agency.title'
                )}
                subtitle={t(
                  'account-registration:form.organizationType.agency.subtitle'
                )}
              />
            </RadioGroup>
          )}
        />
      </Stack>

      <Form.Layout className="text-left" rowGap="6">
        <FormField
          columnSpan={6}
          hasError={!!errors.organization?.name}
          className="w-full"
        >
          <FormField.Label>
            {t('account-registration:form.field.organization.name')}
          </FormField.Label>
          <FormField.Control>
            <Input
              {...register('organization.name')}
              dataTestId="account-registration-organization-name-input"
              dataTrackingId="account-registration-organization-name-input"
              disabled={isDisabled}
            />
          </FormField.Control>
          {!!errors.organization?.name && (
            <FormField.Error>
              {errors.organization.name.message}
            </FormField.Error>
          )}
        </FormField>
        <FormField
          columnSpan={6}
          hasError={!!errors.organization?.websiteUrl}
          className="w-full"
        >
          <FormField.Label>
            {t('account-registration:form.field.organization.websiteUrl')}
          </FormField.Label>
          <FormField.Control>
            <Input
              {...register('organization.websiteUrl')}
              dataTestId="account-registration-organization-website-url-input"
              dataTrackingId="account-registration-organization-website-url-input"
              disabled={isDisabled}
            />
          </FormField.Control>
          {!!errors.organization?.websiteUrl && (
            <FormField.Error>
              {errors.organization.websiteUrl.message}
            </FormField.Error>
          )}
        </FormField>
        <FormField
          columnSpan={3}
          hasError={!!errors.user?.firstName}
          className="w-full"
        >
          <FormField.Label>
            {t('account-registration:form.field.user.firstName')}
          </FormField.Label>
          <FormField.Control>
            <Input
              {...register('user.firstName')}
              dataTestId="account-registration-user-first-name-input"
              dataTrackingId="account-registration-user-first-name-input"
              disabled={isDisabled}
            />
          </FormField.Control>
          {!!errors.user?.firstName && (
            <FormField.Error>{errors.user.firstName.message}</FormField.Error>
          )}
        </FormField>
        <FormField
          columnSpan={3}
          hasError={!!errors.user?.lastName}
          className="w-full"
        >
          <FormField.Label>
            {t('account-registration:form.field.user.lastName')}
          </FormField.Label>
          <FormField.Control>
            <Input
              {...register('user.lastName')}
              dataTestId="account-registration-user-last-name-input"
              dataTrackingId="account-registration-user-last-name-input"
              disabled={isDisabled}
            />
          </FormField.Control>
          {errors.user?.lastName && (
            <FormField.Error>{errors.user.lastName.message}</FormField.Error>
          )}
        </FormField>
        <FormField
          columnSpan={6}
          hasError={!!errors.user?.emailAddress}
          className="w-full"
        >
          <FormField.Label>
            {t('account-registration:form.field.user.emailAddress')}
          </FormField.Label>
          <FormField.Control>
            <Input
              {...register('user.emailAddress')}
              dataTestId="account-registration-user-email-address-input"
              dataTrackingId="account-registration-user-email-address-input"
              disabled={
                isDisabled || authn?.claims?.primary_email !== undefined
              }
            />
          </FormField.Control>
          {errors.user?.emailAddress && (
            <FormField.Error>
              {errors.user.emailAddress.message}
            </FormField.Error>
          )}
        </FormField>
        <FormField
          columnSpan={6}
          hasError={!!errors.agreementCheck}
          className="w-full items-center"
        >
          <div className="pt-2">
            <Controller
              name="agreementCheck"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  dataTestId="account-registration-terms-checkbox"
                  dataTrackingId="account-registration-terms-checkbox"
                  hasError={!!errors.agreementCheck}
                >
                  <Text fontSize="base" className="whitespace-nowrap">
                    <AppTrans
                      t={t}
                      i18nKey="account-registration:form.field.agreementCheck.label"
                      components={{
                        a: (
                          <Link
                            target="_blank"
                            className="underline hover:cursor-pointer text-link"
                            href={agreement.link}
                          />
                        ),
                      }}
                    />
                  </Text>
                </Checkbox>
              )}
            />
          </div>
        </FormField>
      </Form.Layout>
      <Stack className="pb-8 self-center">
        <Button
          dataTestId="account-registration-submit-button"
          dataTrackingId="account-registration-submit-button"
          type="submit"
          width="80"
          loading={isLoading}
          disabled={isDisabled}
        >
          {t('account-registration:form.action.submit')}
        </Button>
      </Stack>
    </Form>
  )
}
