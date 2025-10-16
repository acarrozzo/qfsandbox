import { Heading } from '@mntn-dev/ui-components'
import { themeTextColorMap } from '@mntn-dev/ui-theme'

import type { ComponentPropsWithChildren } from '~/types/props.ts'

export const EmptyState = ({
  title,
  subTitle,
  children,
  className,
}: ComponentPropsWithChildren<{
  title?: string
  subTitle?: string
  className?: string
}>) => {
  return (
    <div className={`${className} flex flex-col gap-8`}>
      <Heading fontSize="2xl" textColor="secondary">
        {title}
      </Heading>
      <span className={`${themeTextColorMap.tertiary}`}>{subTitle}</span>
      {children}
    </div>
  )
}
