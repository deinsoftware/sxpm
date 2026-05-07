import { describe, it, expect } from 'vitest'
import { translateCommand } from 'sxpm'

describe('bun: package commands', () => {
  const cases = [
    { cmd: 'install', args: [], expected: 'bun install' },
    { cmd: 'clean', args: [], expected: 'bun pm cache rm' },
    { cmd: 'add', args: ['react'], expected: 'bun add react' },
    { cmd: 'add', args: ['react', '--global'], expected: 'bun add react --global' },
    { cmd: 'remove', args: ['react'], expected: 'bun remove react' },
    { cmd: 'remove', args: ['react', '--global'], expected: 'bun remove react --global' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['bun'].cli).toBe(expected)
    })
  })
})

describe('bun: shared commands', () => {
  const cases = [
    { cmd: 'init', args: [], expected: 'bun init' },
    { cmd: 'run', args: ['build'], expected: 'bun run build' },
    { cmd: 'test', args: [], expected: 'bun test' },
    { cmd: 'build', args: [], expected: 'bun build' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['bun'].cli).toBe(expected)
    })
  })
})