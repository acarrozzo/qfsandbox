import type { TFunction } from 'i18next'

import { useTranslation } from '@mntn-dev/i18n'
import { Tabs, Text } from '@mntn-dev/ui-components'

import { useTabs } from '~/components/tabs/index.ts'

import {
  primaryServiceStatusTabKeys,
  type ServiceStatusTabKey,
  secondaryServiceStatusTabKeys,
} from './types.ts'

const Tab = (t: TFunction<'service-list'>) => (key: ServiceStatusTabKey) => (
  <Tabs.Tab key={key} name={t(`tabs.${key}`)} id={key} />
)

export const ServiceStatusTabs = () => {
  const { t } = useTranslation('service-list')
  const { currentTab, setCurrentTab } = useTabs<ServiceStatusTabKey>()
  const tab = Tab(t)

  return (
    <Tabs<ServiceStatusTabKey>
      current={currentTab}
      type="simple"
      onClick={setCurrentTab}
    >
      {primaryServiceStatusTabKeys.map(tab)}
      <Text className="mt-2" textColor="disabled">
        |
      </Text>
      {secondaryServiceStatusTabKeys.map(tab)}
    </Tabs>
  )
}
