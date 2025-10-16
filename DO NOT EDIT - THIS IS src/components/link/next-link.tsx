import Link from 'next/link'
import type React from 'react'

import type { AbstractLinkProps } from '@mntn-dev/ui-utilities'

export const NextLink: React.FC<AbstractLinkProps> = ({
  children,
  href,
  ...props
}) => <Link {...{ ...props, href: href ?? '#' }}>{children}</Link>
