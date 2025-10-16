import Link from 'next/link'
import { forwardRef } from 'react'

import type { AgreementType } from '@mntn-dev/domain-types'
import { Trans, useTranslation } from '@mntn-dev/i18n'
import { Checkbox, type CheckboxProps, Text } from '@mntn-dev/ui-components'

import type { ComponentProps } from '~/types/props.ts'

type Props = ComponentProps<
  CheckboxProps & {
    agreementType: Extract<
      AgreementType,
      | 'client-terms'
      | 'maker-terms'
      | 'maker-project-payment-terms'
      | 'credit-terms'
    >
    href: string | undefined
  }
>

export const BidAgreement = forwardRef<HTMLInputElement, Props>(
  ({ agreementType, href, ...checkboxProps }: Props, ref) => {
    const { t } = useTranslation(['bids'])

    return (
      <Checkbox
        {...checkboxProps}
        ref={ref}
        dataTestId={`${agreementType}-checkbox`}
        dataTrackingId={`${agreementType}-checkbox`}
      >
        <Text fontSize="base">
          <Trans
            t={t}
            i18nKey={`bids:${agreementType}`}
            components={{
              CustomLink: href ? (
                <Link
                  target="_blank"
                  href={href}
                  className="text-link underline"
                />
              ) : (
                <span className="animate-pulse" />
              ),
            }}
          />
        </Text>
      </Checkbox>
    )
  }
)
