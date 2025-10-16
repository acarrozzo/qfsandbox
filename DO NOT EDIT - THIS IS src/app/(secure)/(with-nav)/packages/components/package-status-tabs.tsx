import type { TFunction } from 'i18next'

import { useTranslation } from '@mntn-dev/i18n'
import { Tabs, Text } from '@mntn-dev/ui-components'

import { useTabs } from '~/components/tabs/index.ts'

import {
  type PackageStatusTabKey,
  primaryPackageStatusTabKeys,
  secondaryPackageStatusTabKeys,
} from './types.ts'

const Tab = (t: TFunction<'package-list'>) => (key: PackageStatusTabKey) => (
  <Tabs.Tab key={key} name={t(`tabs.${key}`)} id={key} />
)

export const PackageStatusTabs = () => {
  const { t } = useTranslation('package-list')
  const { currentTab, setCurrentTab } = useTabs<PackageStatusTabKey>()
  const tab = Tab(t)

  return (
    <Tabs<PackageStatusTabKey>
      current={currentTab}
      type="simple"
      onClick={setCurrentTab}
    >
      {primaryPackageStatusTabKeys.map(tab)}
      <Text className="mt-2" textColor="disabled">
        |
      </Text>
      {secondaryPackageStatusTabKeys.map(tab)}
    </Tabs>
  )
}
