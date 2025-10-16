import type { registerHighlight } from '@highlight-run/next/server'
import { get } from '@vercel/edge-config'

export type ConsoleMethods = NonNullable<
  Parameters<typeof registerHighlight>[0]['consoleMethodsToRecord']
>

const defaultConsoleMethods: ConsoleMethods = ['debug', 'info', 'warn', 'error']

export const getConsoleMethodsToRecord = async (
  _environment: string
): Promise<ConsoleMethods> => {
  try {
    const consoleMethods = ((await get('consoleMethods')) ??
      defaultConsoleMethods) as ConsoleMethods

    return consoleMethods
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: This function is used setting up console wrapper.
    console.warn('Failed to get console methods to record. Using defaults', {
      error,
      defaultConsoleMethods,
    })
    return defaultConsoleMethods
  }
}
