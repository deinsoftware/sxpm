import { describe, it, expect } from 'vitest'
import { crossTranslate } from 'sxpm'

describe('crossTranslate', () => {
  it('should translate command and args combined', () => {
    const result = crossTranslate({
      command: 'add',
      args: ['react'],
      packageManagers: ['npm']
    })

    expect(result['npm'].command).toBe('install')
    expect(result['npm'].cli).toBe('npm install react')
  })

  it('should translate args along with command', () => {
    const result = crossTranslate({
      command: 'add',
      args: ['react', '--save-dev'],
      packageManagers: ['npm', 'yarn']
    })

    expect(result['npm'].args).toContain('--save-dev')
    expect(result['yarn'].args).toContain('--dev')
  })

  it('should return all PMs when empty array', () => {
    const result = crossTranslate({
      command: 'install',
      args: [],
      packageManagers: []
    })

    expect(Object.keys(result).length).toBeGreaterThan(1)
  })

  it('should handle packageName for upgrade', () => {
    const result = crossTranslate({
      command: 'upgrade',
      args: ['react'],
      packageManagers: ['npm'],
      packageName: 'react'
    })

    expect(result['npm'].command).toBe('add')
  })

  it('should handle errors for unavailable commands', () => {
    const result = crossTranslate({
      command: 'interactive',
      args: [],
      packageManagers: ['npm']
    })

    expect(result['npm'].error).toBeDefined()
  })
})