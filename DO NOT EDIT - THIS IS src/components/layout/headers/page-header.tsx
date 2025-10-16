'use client'

import {
  PageHeader as PageHeaderUIComponent,
  type TestIds,
} from '@mntn-dev/ui-components'

type PageHeaderProps = Readonly<
  TestIds & {
    title: string
  }
>

export const PageHeader = ({
  title,
  dataTestId,
  dataTrackingId,
}: PageHeaderProps) => (
  <PageHeaderUIComponent
    dataTestId={dataTestId}
    dataTrackingId={dataTrackingId}
  >
    <PageHeaderUIComponent.Main>
      <PageHeaderUIComponent.Title title={title} />
    </PageHeaderUIComponent.Main>
  </PageHeaderUIComponent>
)
