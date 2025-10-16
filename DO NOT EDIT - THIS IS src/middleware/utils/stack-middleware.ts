import { type NextMiddleware, NextResponse } from 'next/server'

import type { ClerkMiddlewareAuth } from '@mntn-dev/authentication-server'
/**
 * The stackMiddlewares function is an implementation of the middleware pattern using recursion and function composition.
 * Here's how it works:
 *
 * Purpose: It combines multiple middleware functions into a single middleware function that executes them in sequence.
 *
 * Parameters:
 *
 * functions: An array of middleware chains (each one takes a middleware and returns a middleware)
 * index: The current position in the array (defaults to 0)
 * Recursive Process:
 *
 * It starts with the first middleware in the array
 * For each middleware, it recursively creates a chain with all remaining middlewares
 * Each middleware gets access to the "next" middleware in the chain
 * Execution Flow:
 *
 * When the middleware stack runs, the first middleware executes first
 * Each middleware can:
 * Process the request
 * Call the next middleware in the chain
 * Modify the response from the next middleware
 * Short-circuit the chain by not calling the next middleware
 * Base Case:
 *
 * When there are no more middlewares left, it returns a simple middleware that calls NextResponse.next()
 * For example, with middlewares [withAuthUrlRedirects, withHighlight], the execution flows like:
 *
 * withAuthUrlRedirects runs first and gets withHighlight as its "next" function
 * withHighlight runs when called by withAuthUrlRedirects and gets a basic passthrough function as its "next"
 * Each middleware can process the request/response before or after calling the next middleware
 * This pattern enables clean separation of concerns where each middleware handles a specific aspect of the request processing.
 */

/**
 * A function that takes a `NextMiddleware` function and returns a new `NextMiddleware` function.
 * The middleware function that is passed in is the "next" middleware function in the chain.
 * @param middleware - The next `NextMiddleware` function to be called after the current middleware function.
 * @returns A new `NextMiddleware` function that includes the original `NextMiddleware` function as well as any additional middleware functions in the chain.
 */
export type MiddlewareChain = (
  middleware: NextMiddleware,
  auth?: ClerkMiddlewareAuth
) => NextMiddleware

/**
 * Composes an array of middleware chains into a single middleware function.
 * @param functions - An array of middleware functions to be composed.
 * @param index - The current index of the middleware function being executed.
 * @returns A middleware function that executes all middleware functions in the array.
 */
export function stackMiddlewares(
  functions: MiddlewareChain[] = [],
  auth?: ClerkMiddlewareAuth,
  index = 0
): NextMiddleware {
  const current = functions[index]
  if (current) {
    const next = stackMiddlewares(functions, auth, index + 1)
    return current(next, auth)
  }
  return () => NextResponse.next()
}
