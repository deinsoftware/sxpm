import { describe, it, expect } from 'vitest'
import { translateCommand } from './translate-command.js'

describe('translateCommand', () => {
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

  it('should return same command if no translation needed', () => {
    const result = translateCommand({
      command: 'install',
      args: ['react'],
      targetPM: 'npm'
    })

    expect(result.command).toBe('install')
  })

  it('should throw error for unsupported command', () => {
    expect(() => {
      translateCommand({
        command: 'interactive',
        args: [],
        targetPM: 'npm'
      })
    }).toThrow()
  })
})
