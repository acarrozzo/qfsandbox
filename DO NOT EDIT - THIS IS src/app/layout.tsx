export const dynamic = 'force-dynamic'

import '~/styles/styles.css'

import { dir } from 'i18next'
import { cookies, headers } from 'next/headers'
import type { PropsWithChildren } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { getHeadAssetUrl } from '@mntn-dev/app-assets'
import { CookieParamsCookie } from '@mntn-dev/app-navigation'
import {
  CookieParamsProvider,
  RouterProvider,
} from '@mntn-dev/app-navigation/client'
import { createFlagService } from '@mntn-dev/flags-server'
import { LanguageChanger } from '@mntn-dev/i18n'
import { s } from '@mntn-dev/session'
import { ToastProvider } from '@mntn-dev/ui-components'
import { pageBackgroundMap, themeBackgroundMap } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import { BreadcrumbProvider } from '~/components/breadcrumbs/breadcrumb-provider.tsx'
import { env } from '~/env.js'
import { getServerLanguage } from '~/utils/server/get-server-language'

import { Maintenance } from './(providers)/maintenance.tsx'
import FlagsProvider from './flags-provider'
import LoggerProvider from './logger-provider'

export const metadata = {
  title: 'QuickFrame',
  description: 'QuickFrame',
}

/**
 * The root layout for the app
 */
const RootLayout = async (props: PropsWithChildren) => {
  const { children, ...rest } = props

  const claims = await s.tryGetClaimsDirectlyFromCookie()
  const emailAddress = claims?.primary_email

  const flags = await createFlagService(env.LAUNCHDARKLY_SDK_KEY)

  const featureFlags = emailAddress
    ? await flags.clientFlags(emailAddress)
    : undefined

  const lng = await getServerLanguage()

  const cookieParams = await CookieParamsCookie.get(cookies(), headers())

  return (
    <LoggerProvider>
      <FlagsProvider
        clientSideID={env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID}
        userKey={emailAddress}
        email={emailAddress}
        bootstrapFlags={featureFlags}
      >
        <BreadcrumbProvider>
          <LanguageChanger lng={lng} />
          <HtmlLayout {...rest}>
            <Maintenance>
              <RouterProvider>
                <ToastProvider>
                  <CookieParamsProvider params={cookieParams}>
                    {children}
                  </CookieParamsProvider>
                </ToastProvider>
              </RouterProvider>
            </Maintenance>
          </HtmlLayout>
          <Analytics />
        </BreadcrumbProvider>
      </FlagsProvider>
    </LoggerProvider>
  )
}

const HtmlLayout = async ({ children }: PropsWithChildren) => {
  const lng = await getServerLanguage()

  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={getHeadAssetUrl('apple-touch-icon')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={getHeadAssetUrl('favicon-32')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={getHeadAssetUrl('favicon-16')}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="mask-icon"
          href={getHeadAssetUrl('safari-pinned-tab')}
          color="#7c888c"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link href="/css/neue-haas.css" rel="stylesheet" />
        <meta name="apple-mobile-web-app-title" content="QuickFrame" />
        <meta name="application-name" content="QuickFrame" />
        <meta name="msapplication-TileColor" content="#2b5797" />
      </head>
      <body
        className={cn(
          'relative bg-cover bg-center bg-fixed',
          themeBackgroundMap.page,
          pageBackgroundMap.default
        )}
      >
        {children}
      </body>
    </html>
  )
}

export default RootLayout
