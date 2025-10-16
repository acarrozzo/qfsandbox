'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Options = {
  delay?: number
  postpone?: boolean
}

/**
 * A custom useDebounce implementation. It was done this way to more easily integrate with react-hook-form/trpc.
 *
 * Imagine a scenario where an input fires many events, and during that time a mutation starts running. We want to postpone
 * events while the mutation is happening while still remembering the latest event so we can eventually run it.
 * This is where the postpone option comes into play.
 *
 * The callback will run after the later of:
 * - postpone becoming false
 * - the timeout expiring
 *
 * The timer synchronization is done in an effect instead of a callback so it can react to the `postpone` option changing.
 */
export const useDebouncedCallback = <
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(
  callback: T,
  { delay = 250, postpone = false }: Options = {}
) => {
  const callbackRef = useRef(callback)
  const [next, setNext] = useState<{ args: Parameters<T> } | null>(null)

  useLayoutEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    let timer: number | null = null

    if (!postpone && next) {
      timer = window.setTimeout(() => {
        callbackRef.current(...next.args)
        setNext(null)
        timer = null
      }, delay)
    }

    return () => {
      if (timer !== null) {
        window.clearTimeout(timer)
        timer = null
      }
    }
  }, [next, postpone, delay])

  const handler = (...args: Parameters<T>) => setNext({ args })

  return handler
}
