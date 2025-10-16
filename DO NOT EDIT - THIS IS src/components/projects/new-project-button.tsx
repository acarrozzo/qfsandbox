'use client'

import { useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import { Button } from '@mntn-dev/ui-components'

import { useMe } from '~/hooks/secure/use-me.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

export const NewProjectButton = () => {
  const router = useRouter()
  const { meOnATeam } = useMe()
  const { t } = useTranslation('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const { hasPermission } = usePermissions()
  const handleClick = () => {
    setIsLoading(true)
    router.push(route('/projects/new'))
  }
  return hasPermission('project:create') && meOnATeam ? (
    <Button
      width="fit"
      onClick={handleClick}
      iconRight="add"
      loading={isLoading}
      dataTestId="new-project-button"
    >
      {t('brand.create-project')}
    </Button>
  ) : null
}
