'use client'

import { forwardRef } from 'react'

import type {
  OrganizationDomainSelectModel,
  OrganizationId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Select, type SelectProps } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

type OrganizationSelectProps = Omit<
  SelectProps<OrganizationId>,
  'placeholder' | 'deselectable' | 'options'
> & { organizations: OrganizationDomainSelectModel[] }

export const OrganizationSelect = forwardRef<
  HTMLDivElement,
  OrganizationSelectProps
>(({ organizations, ...selectProps }, ref) => {
  const { t } = useTranslation('organizations')

  return (
    <Select
      {...selectProps}
      ref={ref}
      placeholder={t('select.placeholder')}
      deselectable={false}
      options={organizations.map((organization) => ({
        value: organization.organizationId,
        label: organization.name,
      }))}
    />
  )
})

type AllOrganizationSelectProps = Omit<
  SelectProps<OrganizationId>,
  'placeholder' | 'options'
>

export const AllOrganizationSelect = forwardRef<
  HTMLDivElement,
  AllOrganizationSelectProps
>((props, ref) => {
  const { t } = useTranslation('organizations')
  const [organizations] =
    trpcReactClient.organizations.listCompactOrganizations.useSuspenseQuery({})

  const options = organizations.map((organization) => ({
    value: organization.organizationId,
    label: organization.name,
  }))

  const placeholder = t('select.placeholder')

  // this sucks, but some branch typing is necessary to use the Select component with the optional deselectable prop
  // when deselectable is true, the onChange callback signature is (value: OrganizationId | null) => void
  // when deselectable is false, the onChange callback signature is (value: OrganizationId) => void
  if (props.deselectable === true) {
    return (
      <Select
        {...(props as SelectProps<OrganizationId>)}
        className="h-10 w-48"
        ref={ref}
        placeholder={placeholder}
        options={options}
      />
    )
  }

  return (
    <Select
      {...props}
      className="h-10 w-48"
      deselectable={false}
      ref={ref}
      placeholder={placeholder}
      options={options}
    />
  )
})
