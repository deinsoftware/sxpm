import { describe, it, expect } from 'vitest'
import { translateCommand } from './translate-command.js'

describe('translateCommand', () => {
  // npm translations
  it('should translate "remove" to "uninstall" for npm', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['react'],
      targetPM: 'npm'
    })

    expect(result.command).toBe('uninstall')
    expect(result.args).toContain('react')
  })

  it('should translate "upgrade" with args for npm', () => {
    const result = translateCommand({
      command: 'upgrade',
      args: ['react'],
      targetPM: 'npm'
    })

    expect(result.command).toBe('add')
    expect(result.args).toContain('--latest')
  })

  // yarn doesn't have install translation (stays as install)
  it('should keep "install" for yarn (no translation defined)', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      targetPM: 'yarn'
    })

    expect(result.command).toBe('install')
  })

  it('should keep "remove" for yarn', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['react'],
      targetPM: 'yarn'
    })

    expect(result.command).toBe('remove')
  })

  // pnpm translations
  it('should keep "install" for pnpm', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      targetPM: 'pnpm'
    })

    expect(result.command).toBe('install')
  })

  it('should translate "remove" to "uninstall" for pnpm', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['react'],
      targetPM: 'pnpm'
    })

    expect(result.command).toBe('uninstall')
  })

  // bun translations
  it('should keep "install" for bun', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      targetPM: 'bun'
    })

    expect(result.command).toBe('install')
  })

  // deno translations
  it('should keep "install" for deno', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      targetPM: 'deno'
    })

    expect(result.command).toBe('install')
  })

  // no translation needed
  it('should return same command if no translation needed', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      targetPM: 'npm'
    })

    expect(result.command).toBe('install')
  })

  // unsupported command should throw error
  it('should throw error for unsupported command', () => {
    expect(() =>
      translateCommand({
        command: 'interactive',
        args: [],
        targetPM: 'npm'
      })
    ).toThrow('The interactive command is not available on npm')
  })

  // object-type action (positional arg translation)
  it('should handle object-type action for run command in npm', () => {
    const result = translateCommand({
      command: 'run',
      args: ['build', '--'],
      targetPM: 'npm'
    })

    expect(result.command).toBe('run')
    expect(result.args).toContain('--')
    expect(result.args).toContain('build')
  })

  it('should handle object-type action with key at index > 0', () => {
    const result = translateCommand({
      command: 'run',
      args: ['build', '--'],
      targetPM: 'npm'
    })

    expect(result.command).toBe('run')
    expect(result.args).toContain('--')
    expect(result.args).toContain('build')
  })

  it('should handle object-type action for create command in npm', () => {
    const result = translateCommand({
      command: 'create',
      args: ['--', 'react-app'],
      targetPM: 'npm'
    })

    expect(result.command).toBe('create')
    expect(result.args).toContain('--')
    expect(result.args).toContain('react-app')
  })

  // no config found
  it('should return original when config not found', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      targetPM: 'invalid' as any
    })

    expect(result.command).toBe('install')
    expect(result.args).toContain('react')
  })

  // replaceCommand: when args contains the command string
  it('should replace command in args if present', () => {
    const result = translateCommand({
      command: 'remove',
      args: ['remove', 'react'],
      targetPM: 'npm'
    })

    expect(result.command).toBe('uninstall')
    expect(result.args).toContain('uninstall')
    expect(result.args).toContain('react')
    expect(result.args).not.toContain('remove')
  })
})