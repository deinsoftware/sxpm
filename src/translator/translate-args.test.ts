import { describe, it, expect } from 'vitest'
import { translateArgs, cleanFlag } from 'sxpm'

describe('translateArgs', () => {
  it('should translate --frozen to --frozen-lockfile for pnpm', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      packageManagers: ['pnpm']
    })

    expect(result['pnpm'].args).toContain('--frozen-lockfile')
    expect(result['pnpm'].args).not.toContain('--frozen')
  })

  it('should translate to multiple package managers', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      packageManagers: ['pnpm', 'yarn']
    })

    expect(result['pnpm'].args).toContain('--frozen-lockfile')
    expect(result['yarn'].args).toContain('--frozen-lockfile')
  })

  it('should keep --save-dev for pnpm', () => {
    const result = translateArgs({
      args: ['add', '--save-dev'],
      packageManagers: ['pnpm']
    })

    expect(result['pnpm'].args).toContain('--save-dev')
  })

  it('should keep --save-dev for yarn (no translation defined)', () => {
    const result = translateArgs({
      args: ['add', '--save-dev'],
      packageManagers: ['yarn']
    })

    expect(result['yarn'].args).toContain('--dev')
  })

  it('should translate --frozen to --frozen-lockfile for yarn', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      packageManagers: ['yarn']
    })

    expect(result['yarn'].args).toContain('--frozen-lockfile')
    expect(result['yarn'].args).not.toContain('--frozen')
  })

  it('should remove --frozen for bun', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      packageManagers: ['bun']
    })

    expect(result['bun'].args).not.toContain('--frozen')
    expect(result['bun'].args).toContain('install')
  })

  it('should translate --package-lock to --no-lock for deno', () => {
    const result = translateArgs({
      args: ['install', '--package-lock'],
      packageManagers: ['deno']
    })

    expect(result['deno'].args).toContain('--no-lock')
    expect(result['deno'].args).not.toContain('--package-lock')
  })

  it('should translate --frozen to ci when command is install for npm', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      packageManagers: ['npm'],
      command: 'install'
    })

    expect(result['npm'].args).toContain('ci')
    expect(result['npm'].args).not.toContain('--frozen')
    expect(result['npm'].args).not.toContain('install')
  })

  it('should keep args without translation', () => {
    const result = translateArgs({
      args: ['install', '--verbose'],
      packageManagers: ['npm']
    })

    expect(result['npm'].args).toContain('--verbose')
  })

  it('should remove flag without value', () => {
    const args = ['install', '--frozen']
    cleanFlag(args, '--frozen')
    expect(args).not.toContain('--frozen')
  })

  it('should remove flag with value', () => {
    const args = ['install', '--registry', 'https://registry.npmjs.org']
    cleanFlag(args, '--registry', true)
    expect(args).not.toContain('--registry')
    expect(args).not.toContain('https://registry.npmjs.org')
  })

  it('should return original args if targetPM config not found', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      packageManagers: ['invalid' as any]
    })

    expect(result['invalid' as any].args).toEqual(['install', '--frozen'])
  })

  it('should translate --latest for npm', () => {
    const result = translateArgs({
      args: ['upgrade', 'react', '--latest'],
      packageManagers: ['npm'],
      command: 'upgrade'
    })

    expect(result['npm'].args).not.toContain('--latest')
    expect(result['npm'].args).toContain('react')
  })

  it('should use all package managers when empty array', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      packageManagers: []
    })

    expect(Object.keys(result).length).toBeGreaterThan(1)
  })

  it('should handle deno@2.0.0', () => {
    const result = translateArgs({
      args: ['install', '--frozen'],
      packageManagers: ['deno@2.0.0']
    })

    expect(result['deno@2.0.0']).toBeDefined()
  })
})