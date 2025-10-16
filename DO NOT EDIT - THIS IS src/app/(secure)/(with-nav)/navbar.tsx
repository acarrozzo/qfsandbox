'use client'

import Image from 'next/image'

import { getAssetUrl } from '@mntn-dev/app-assets'
import { usePathname, useRouter } from '@mntn-dev/app-navigation'
import { type AnyRoute, route } from '@mntn-dev/app-routing'
import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import { useTranslation } from '@mntn-dev/i18n'
import {
  getTestProps,
  Navigation,
  type NavigationIconItemProps,
  useOpenState,
} from '@mntn-dev/ui-components'

import { organizationTypeBorderColorMap } from '~/components/avatar/helper.ts'
import { usePersonImageUrlInterceptor } from '~/components/avatar/use-person-image-url-interceptor.tsx'
import { useNotificationsQuery } from '~/components/notification/hooks/use-notifications-query.ts'
import { Notifications } from '~/components/notification/notifications.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'
import { usePermissions } from '~/hooks/secure/use-permissions'

type NavigationItem = NavigationIconItemProps & {
  authorized: () => boolean
  unreadNotificationCount?: number
  onClick: () => void
  selected: (navigationItem: NavigationItem) => boolean
}

export const Navbar = () => {
  const { me } = useMe()
  const { t } = useTranslation('navbar')
  const router = useRouter()
  const currentPath = usePathname()
  const { hasPermission } = usePermissions()

  const { person } = usePersonImageUrlInterceptor(me, {
    height: 116,
    width: 116,
  })

  const selectedRoute = (route: AnyRoute) => () =>
    route.isMatch(currentPath, false)

  const notificationsOpenState = useOpenState()
  const { unreadNotificationCount } = useNotificationsQuery({ enabled: true })

  const navigationMap: NavigationItem[] = [
    {
      iconName: 'nav-projects',
      title: t('projects'),
      onClick: () => {
        router.push(route('/dashboard'))
      },
      authorized: () => true,
      selected: selectedRoute(route('/dashboard')),
      dataTestId: 'main-app-navigation-bar-item-projects',
      dataTrackingId: 'main-app-navigation-bar-item-projects',
    },
    {
      iconName: 'nav-organizations',
      title: t('organizations'),
      onClick: () => {
        router.push(route('/account/organizations'))
      },
      authorized: () => hasPermission('customer-organization:administer'),
      selected: selectedRoute(route('/account/organizations')),
      dataTestId: 'main-app-navigation-bar-item-organizations',
      dataTrackingId: 'main-app-navigation-bar-item-organizations',
    },
    {
      iconName: 'nav-packages',
      title: t('packages'),
      onClick: () => {
        router.push(route('/packages'))
      },
      authorized: () => hasPermission('package:administer'),
      selected: selectedRoute(route('/packages')),
      dataTestId: 'main-app-navigation-bar-item-packages',
      dataTrackingId: 'main-app-navigation-bar-item-packages',
    },
  ]

  const handleLogoClick = () => {
    router.push(route('/projects'))
  }

  const handleAvatarClick = () => {
    router.push(route('/account/profile'))
  }

  return (
    <Navigation>
      <Navigation.Header>
        <button
          type="button"
          onClick={handleLogoClick}
          {...getTestProps({ dataTestId: 'main-app-navigation-bar-header' })}
        >
          <Image
            src={getAssetUrl('quickframe-logo-nav')}
            width={54}
            height={36}
            alt="QuickFrame"
            className="h-9 w-[54px]"
          />
        </button>
      </Navigation.Header>
      <Navigation.Main>
        <Navigation.Items>
          {navigationMap.map((itemProps) =>
            itemProps.authorized() ? (
              <Navigation.IconItem key={itemProps.iconName} {...itemProps} />
            ) : null
          )}
        </Navigation.Items>
        <Navigation.Items>
          <Navigation.IconItem
            key="nav-bell"
            {...{
              iconName: 'nav-bell',
              title: t('alerts'),
              onClick: notificationsOpenState.onToggle,
              authorized: () => true,
              selected: () => false,
              unreadNotificationCount,
              dataTestId: 'main-app-navigation-bar-item-notifications',
              dataTrackingId: 'main-app-navigation-bar-item-notifications',
            }}
          />
          <Navigation.AvatarItem
            dataTestId="main-app-navigation-bar-item-profile"
            borderColor={organizationTypeBorderColorMap[me.organizationType]}
            person={person}
            image={NextImage({ unoptimized: true })}
            onClick={handleAvatarClick}
            selected={selectedRoute(route('/account'))}
          />
        </Navigation.Items>
      </Navigation.Main>
      <Notifications {...notificationsOpenState} />
    </Navigation>
  )
}
