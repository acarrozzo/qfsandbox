import type { Env } from '../types/env.ts'

export type RequiredEnvVars = Partial<
  Pick<Env, 'APP_BASE_URL' | 'CUSTOM_URL' | 'VERCEL_URL'>
>
