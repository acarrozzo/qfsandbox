import type React from 'react'
import type { EmptyObject } from 'type-fest'

/**
 * Use this type when defining a component with props.
 * All props are marked as readonly which is considered a best practice in React.
 */
export type ComponentProps<T> = Readonly<T>

/**
 * Use this type when defining a component with props including children.
 * All props are marked as readonly which is considered a best practice in React.
 * This type also includes the { readonly children?: ReactNode } prop without the need to define it.
 */
export type ComponentPropsWithChildren<T> = ComponentProps<
  React.PropsWithChildren<T>
>

/**
 * Use this type when defining a component that does not have any props other than children.
 */
export type ComponentChildren = ComponentPropsWithChildren<EmptyObject>
