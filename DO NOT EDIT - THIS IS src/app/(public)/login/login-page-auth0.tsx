'use client'

import { useEffect, useState } from 'react'

import { getAssetUrl } from '@mntn-dev/app-assets'
import { route } from '@mntn-dev/app-routing'
import {
  Button,
  CenteredLayout,
  Input,
  LoginBox,
} from '@mntn-dev/auth-components'
import { useFlags } from '@mntn-dev/flags-client'
import { useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { formSchema, onSubmit } from './form-handler.ts'

export const LoginPageAuth0 = () => {
  const flags = useFlags()
  const { t } = useTranslation('login')
  const { t: tValidation } = useTranslation('validation')
  const trpcUtils = trpcReactClient.useUtils()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MNTN_PASS === 'true') {
      window.location.href = route('/api/auth/logout').toAbsoluteUrl()
    }
  }, [])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setFocus,
  } = useForm({
    resolver: zodResolver(
      formSchema({
        restrictedLogins: flags.magicskyRestrictedLogins,
        emailErrorMessage: t('unsupported-email'),
      }),
      tValidation
    ),
    defaultValues: {
      emailAddress: '',
      returnTo: route('/auth/callback').toAbsoluteUrl(),
    },
  })

  const handleSubmitClick = (data: { emailAddress: string }) => {
    setLoading(true)
    onSubmit(trpcUtils.client, data).catch(() => {
      setLoading(false)
      setError(
        'emailAddress',
        { type: 'focus', message: t('unavailable') },
        { shouldFocus: true }
      )
    })
  }

  useEffect(() => {
    setFocus('emailAddress')
  }, [setFocus])

  return (
    <CenteredLayout background="default">
      <LoginBox>
        <LoginBox.Header
          image={{
            url: getAssetUrl('quickframe-logo'),
            alt: t('alt'),
          }}
          title={t('title')}
          subtitle={t('subtitle')}
        />
        <LoginBox.Body>
          <LoginBox.Form onSubmit={handleSubmit(handleSubmitClick)}>
            <LoginBox.FormField>
              <Input
                label={t('email')}
                id="emailAddress"
                hasError={!!errors.emailAddress}
                {...register('emailAddress')}
              />
              {errors.emailAddress && (
                <LoginBox.FormFieldError>
                  {errors?.emailAddress.message ?? ''}
                </LoginBox.FormFieldError>
              )}
            </LoginBox.FormField>
            <LoginBox.FormFooter
              signUp={t('sign-up')}
              haveAccount={t('have-account')}
            >
              <Button loading={loading} type="submit">
                {t('continue')}
              </Button>
            </LoginBox.FormFooter>
          </LoginBox.Form>
        </LoginBox.Body>
      </LoginBox>
    </CenteredLayout>
  )
}
