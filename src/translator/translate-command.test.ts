import { describe, it, expect } from 'vitest'
import { translateCommand } from 'sxpm'

describe('translateCommand', () => {
  it('should translate "remove" to "uninstall" for npm', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['react'],
      packageManagers: ['npm']
    })

    expect(result['npm'].command).toBe('uninstall')
    expect(result['npm'].args).toContain('react')
    expect(result['npm'].cli).toContain('uninstall')
  })

  it('should translate to multiple package managers', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['react'],
      packageManagers: ['npm', 'pnpm']
    })

    expect(result['npm'].command).toBe('uninstall')
    expect(result['pnpm'].command).toBe('uninstall')
  })

  it('should translate "upgrade" with args for npm', () => {
    const result = translateCommand({
      command: 'upgrade',
      args: ['react'],
      packageManagers: ['npm']
    })

    expect(result['npm'].command).toBe('add')
    expect(result['npm'].args).toContain('<package>@latest')
  })

  it('should keep "install" for yarn (no translation defined)', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      packageManagers: ['yarn']
    })

    expect(result['yarn'].command).toBe('install')
  })

  it('should keep "remove" for yarn', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['react'],
      packageManagers: ['yarn']
    })

    expect(result['yarn'].command).toBe('remove')
  })

  it('should keep "install" for pnpm', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      packageManagers: ['pnpm']
    })

    expect(result['pnpm'].command).toBe('install')
  })

  it('should translate "remove" to "uninstall" for pnpm', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['react'],
      packageManagers: ['pnpm']
    })

    expect(result['pnpm'].command).toBe('uninstall')
  })

  it('should keep "install" for bun', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      packageManagers: ['bun']
    })

    expect(result['bun'].command).toBe('install')
  })

  it('should keep "install" for deno', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      packageManagers: ['deno']
    })

    expect(result['deno'].command).toBe('install')
  })

  it('should return same command if no translation needed', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      packageManagers: ['npm']
    })

    expect(result['npm'].command).toBe('install')
  })

  it('should return error for unsupported command', () => {
    const result = translateCommand({
      command: 'interactive',
      args: [],
      packageManagers: ['npm']
    })

    expect(result['npm'].error).toBeDefined()
    expect(result['npm'].error).toContain('not available')
  })

  it('should handle object-type action for run command in npm', () => {
    const result = translateCommand({
      command: 'run',
      args: ['build', '--'],
      packageManagers: ['npm']
    })

    expect(result['npm'].command).toBe('run')
    expect(result['npm'].args).toContain('--')
    expect(result['npm'].args).toContain('build')
  })

  it('should handle object-type action for create command in npm', () => {
    const result = translateCommand({
      command: 'create',
      args: ['--', 'react-app'],
      packageManagers: ['npm']
    })

    expect(result['npm'].command).toBe('create')
    expect(result['npm'].args).toContain('--')
    expect(result['npm'].args).toContain('react-app')
  })

  it('should return original when config not found', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      packageManagers: ['invalid' as any]
    })

    expect(result['invalid' as any].command).toBe('install')
    expect(result['invalid' as any].args).toContain('react')
  })

  it('should replace command in args if present', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['remove', 'react'],
      packageManagers: ['npm']
    })

    expect(result['npm'].command).toBe('uninstall')
    expect(result['npm'].args).toContain('uninstall')
    expect(result['npm'].args).toContain('react')
    expect(result['npm'].args).not.toContain('remove')
  })

  it('should use all package managers when empty array', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['react'],
      packageManagers: []
    })

    expect(Object.keys(result).length).toBeGreaterThan(1)
  })

  it('should handle yarn@berry', () => {
    const result = translateCommand({
      command: 'upgrade',
      args: ['react'],
      packageManagers: ['yarn@berry']
    })

    expect(result['yarn@berry']).toBeDefined()
  })

  it('should differentiate deno versions', () => {
    const resultDeno2 = translateCommand({
      command: 'upgrade',
      args: ['react'],
      packageManagers: ['deno@2.0.0']
    })

    expect(resultDeno2['deno@2.0.0']).toBeDefined()
    expect(resultDeno2['deno@2.0.0'].cli).toBeDefined()
  })
})