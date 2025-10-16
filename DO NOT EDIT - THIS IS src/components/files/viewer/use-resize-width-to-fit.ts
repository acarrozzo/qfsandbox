import { type RefObject, useState } from 'react'

import { useResizeObserver } from '@mntn-dev/ui-utilities'

import { useDebouncedCallback } from '~/utils/use-debounced-callback.ts'

type Props = {
  targetRef: RefObject<HTMLElement>
  destinationRef: RefObject<HTMLElement>
}

/**
 * A custom hook that takes a target element that needs to fit into a destination element's bounding box.
 * Useful for a cloudinary video player that cannot simply be constrained to its parent's height.
 */
export const useResizeWidthToFit = ({ targetRef, destinationRef }: Props) => {
  const [resizedWidth, setResizedWidth] = useState<string>()
  const [isSized, setIsSized] = useState(false)

  const onResize = useDebouncedCallback(
    () => {
      const { current: destinationElement } = destinationRef
      const { current: targetElement } = targetRef

      if (!(destinationElement && targetElement)) {
        return
      }

      const { clientHeight: destinationHeight } = destinationElement

      const { scrollWidth: targetWidth, scrollHeight: targetHeight } =
        targetElement

      if (!(destinationHeight && targetWidth && targetHeight)) {
        return
      }

      const aspectRatio = targetWidth / targetHeight
      const newWidth = Math.floor(destinationHeight * aspectRatio)

      setResizedWidth(`${newWidth}px`)
      setIsSized(true)
    },
    { delay: 10 }
  )

  // We need both resize observers below in case either the target or destination change size

  // target size changed
  useResizeObserver({
    ref: targetRef,
    box: 'content-box',
    onResize,
  })

  // destination size changed
  useResizeObserver({
    ref: destinationRef,
    box: 'content-box',
    onResize,
  })

  return {
    isSized,
    resizedWidth,
  }
}
