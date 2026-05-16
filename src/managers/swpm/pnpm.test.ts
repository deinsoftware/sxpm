import { describe, it, expect } from 'vitest'
import { translateCommand } from 'sxpm'

describe('pnpm: package commands', () => {
  const cases = [
    { cmd: 'install', args: [], expected: 'pnpm install' },
    { cmd: 'install', args: ['--frozen'], expected: 'pnpm install --frozen' },
    { cmd: 'add', args: ['react'], expected: 'pnpm add react' },
    { cmd: 'add', args: ['react', '--global'], expected: 'pnpm add react --global' },
    { cmd: 'add', args: ['react', '--save-dev'], expected: 'pnpm add react --save-dev' },
    { cmd: 'add', args: ['react', '--save-optional'], expected: 'pnpm add react --save-optional' },
    { cmd: 'add', args: ['react', '--save-peer'], expected: 'pnpm add react --save-peer' },
    { cmd: 'add', args: ['react', '--save-exact'], expected: 'pnpm add react --save-exact' },
    { cmd: 'remove', args: ['react'], expected: 'pnpm uninstall react' },
    { cmd: 'remove', args: ['react', '--save-dev'], expected: 'pnpm uninstall react --save-dev' },
    { cmd: 'remove', args: ['react', '--save-optional'], expected: 'pnpm uninstall react --save-optional' },
    { cmd: 'remove', args: ['react', '--save-peer'], expected: 'pnpm uninstall react --save-peer' },
    { cmd: 'remove', args: ['react', '--global'], expected: 'pnpm uninstall react --global' },
    { cmd: 'update', args: ['react'], expected: 'pnpm update react' },
    { cmd: 'upgrade', args: ['react'], expected: 'pnpm update react --latest' },
    { cmd: 'upgrade', args: ['react', '--global'], expected: 'pnpm update react --global --latest' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['pnpm'].cli).toBe(expected)
    })
  })
})

describe('pnpm: unavailable commands (N/A)', () => {
  it('clean should return error', () => {
    const result = translateCommand({ command: 'clean', args: [], packageManagers: ['pnpm'] })
    expect(result['pnpm'].error).toBeDefined()
  })
})

describe('pnpm: shared commands', () => {
  const cases = [
    { cmd: 'init', args: [], expected: 'pnpm init' },
    { cmd: 'login', args: [], expected: 'pnpm login' },
    { cmd: 'logout', args: [], expected: 'pnpm logout' },
    { cmd: 'run', args: ['build'], expected: 'pnpm run build' },
    { cmd: 'test', args: [], expected: 'pnpm test' },
    { cmd: 'build', args: [], expected: 'pnpm build' },
    { cmd: 'publish', args: [], expected: 'pnpm publish' },
    { cmd: 'unpublish', args: ['pkg'], expected: 'pnpm unpublish pkg' },
    { cmd: 'unpublish', args: ['pkg@1.0.0'], expected: 'pnpm unpublish pkg@1.0.0' },
    { cmd: 'deprecate', args: ['pkg', 'message'], expected: 'pnpm deprecate pkg message' },
    { cmd: 'config', args: ['list'], expected: 'pnpm config list' },
    { cmd: 'config', args: ['set', 'save-exact', 'true'], expected: 'pnpm config set save-exact true' },
    { cmd: 'config', args: ['set', 'save-prefix', '~'], expected: 'pnpm config set save-prefix ~' },
    { cmd: 'outdated', args: [], expected: 'pnpm outdated' },
    { cmd: 'outdated', args: ['react'], expected: 'pnpm outdated react' },
    { cmd: 'outdated', args: ['--global'], expected: 'pnpm outdated --global' },
    { cmd: 'link', args: [], expected: 'pnpm link' },
    { cmd: 'link', args: ['folder'], expected: 'pnpm link folder' },
    { cmd: 'unlink', args: [], expected: 'pnpm unlink' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['pnpm'].cli).toBe(expected)
    })
  })
})