import { describe, it, expect } from 'vitest'
import {
  getPackageConfig,
  packageExists,
  availablePackages,
  translateCommand,
  translateArgs,
  cleanFlag
} from 'sxpm'

describe('index exports', () => {
  it('should return config for valid package manager', () => {
    const config = getPackageConfig('npm')
    expect(config).toBeDefined()
    expect(config?.cmd).toBe('npm')
  })

  it('should return undefined for invalid package manager', () => {
    const config = getPackageConfig('invalid' as any)
    expect(config).toBeUndefined()
  })

  it('should check if package exists', () => {
    expect(packageExists('npm')).toBe(true)
    expect(packageExists('pnpm')).toBe(true)
    expect(packageExists('invalid')).toBe(false)
  })

  it('should return available packages list', () => {
    const packages = availablePackages()
    expect(packages).toContain('npm')
    expect(packages).toContain('pnpm')
    expect(packages).toContain('yarn')
    expect(packages).toContain('deno')
    expect(packages.length).toBe(6)
  })

  it('should have translateCommand exported', () => {
    expect(translateCommand).toBeDefined()
    expect(typeof translateCommand).toBe('function')
  })

  it('should have translateArgs exported', () => {
    expect(translateArgs).toBeDefined()
    expect(typeof translateArgs).toBe('function')
  })

  it('should have cleanFlag exported', () => {
    expect(cleanFlag).toBeDefined()
    expect(typeof cleanFlag).toBe('function')
  })
})