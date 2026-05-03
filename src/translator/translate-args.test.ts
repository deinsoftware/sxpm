import { describe, it, expect } from 'vitest'
import { translateArgs } from './translate-args.js'

describe('translateArgs', () => {
  it('should translate --frozen to --frozen-lockfile for pnpm', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      targetPM: 'pnpm'
    })

    expect(result.args).toContain('--frozen-lockfile')
    expect(result.args).not.toContain('--frozen')
  })

  it('should remove unsupported args for bun', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      targetPM: 'bun'
    })

    expect(result.args).not.toContain('--frozen')
    expect(result.args).toContain('install')
  })

  it('should keep args without translation', () => {
    const result = translateArgs({
      args: ['install', '--verbose'],
      targetPM: 'npm'
    })

    expect(result.args).toContain('--verbose')
  })
})
