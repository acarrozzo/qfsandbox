import { useEffect, useState } from 'react'

import { type UseFormReturn, useFormContext } from '@mntn-dev/forms'
import {
  forwardRef,
  Heading,
  type HeadingProps,
  IconButton,
  Input,
  type InputProps,
  Stack,
} from '@mntn-dev/ui-components'
import {
  fontSizeMap,
  type HeadingSize,
  themeTextColorMap,
} from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

export type InlineMode = 'readonly' | 'readwrite'
export type InlineState = 'view' | 'edit'

type InlineInputProps = InputProps & {
  readonly?: boolean
  placeholder?: string
  heading?: HeadingProps
}

const defaultFontSize: HeadingSize = '3xl'

export const InlineInput = forwardRef<HTMLInputElement, InlineInputProps>(
  (
    {
      readonly,
      placeholder,
      className,
      heading = { fontSize: defaultFontSize },
      disabled,
      ...props
    }: InlineInputProps,
    outerRef
  ) => {
    const inlineMode: InlineMode = readonly === true ? 'readonly' : 'readwrite'
    const [inlineState, setInlineState] = useState<InlineState>('view')
    const { watch, getFieldState }: UseFormReturn = useFormContext()

    const canEdit = inlineMode !== 'readonly'
    const { name = '' } = props
    const { error } = getFieldState(name)
    const value = watch(name)

    useEffect(() => {
      if (error) {
        setInlineState('edit')
      }
    }, [error])

    const handleBlur = () => {
      if (!error) {
        setInlineState('view')
      }
    }

    const handleEditClick = () => !disabled && canEdit && setInlineState('edit')

    return inlineState === 'edit' ? (
      <Input
        {...props}
        unStyled={true}
        ref={outerRef}
        className={cn(
          `focus:caret-brand font-heading w-full p-0 ${fontSizeMap[heading.fontSize ?? defaultFontSize]} font-bold ${themeTextColorMap.tertiary}`,
          className
        )}
        onBlur={handleBlur}
        autoFocus
      />
    ) : (
      <Heading {...heading} onClick={canEdit ? handleEditClick : undefined}>
        <Stack className="items-center" gap="4">
          {value ?? placeholder}
          {canEdit && (
            <IconButton
              name="pencil"
              size="lg"
              onClick={handleEditClick}
              disabled={disabled}
            />
          )}
        </Stack>
      </Heading>
    )
  }
)
