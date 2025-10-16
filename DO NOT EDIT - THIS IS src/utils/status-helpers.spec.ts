import { describe, expect, it } from 'vitest'

import type { ProjectStatus } from '@mntn-dev/domain-types'

import { evaluateStatus } from './status-helpers.ts'

describe('evaluateStatus', () => {
  it('should correctly convert to title case', () => {
    const result = evaluateStatus('pre_production_complete' as ProjectStatus)
    expect(result).toEqual({
      isPreProductionComplete: true,
    })
  })
})
