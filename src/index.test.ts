import { describe, it, expect } from 'vitest'
import { getPackageConfig, packageExists, availablePackages } from './index.js'

// Test that index.ts properly re-exports everything
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
    expect(packages.length).toBe(6)
  })

  // Verify re-exports exist (type imports can't be tested at runtime)
  it('should have translateCommand exported', async () => {
    const module = await import('./index.js')
    expect(module.translateCommand).toBeDefined()
    expect(typeof module.translateCommand).toBe('function')
  })

  it('should have translateArgs exported', async () => {
    const module = await import('./index.js')
    expect(module.translateArgs).toBeDefined()
    expect(typeof module.translateArgs).toBe('function')
  })

  it('should have cleanFlag exported', async () => {
    const module = await import('./index.js')
    expect(module.cleanFlag).toBeDefined()
    expect(typeof module.cleanFlag).toBe('function')
  })
})
