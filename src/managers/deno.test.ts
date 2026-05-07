import { describe, it, expect } from 'vitest'
import { translateCommand } from 'sxpm'

describe('deno: package commands', () => {
  const cases = [
    { cmd: 'install', args: [], expected: 'deno install' },
    { cmd: 'install', args: ['--frozen'], expected: 'deno install --frozen' },
    { cmd: 'add', args: ['react'], expected: 'deno add react' },
    { cmd: 'remove', args: ['react'], expected: 'deno remove react' },
    { cmd: 'upgrade', args: ['react'], expected: 'deno add react' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['deno'].cli).toBe(expected)
    })
  })
})

describe('deno: shared commands', () => {
  const cases = [
    { cmd: 'init', args: [], expected: 'deno init' },
    { cmd: 'run', args: ['build'], expected: 'deno task build' },
    { cmd: 'test', args: [], expected: 'deno test' },
    { cmd: 'publish', args: [], expected: 'deno publish' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['deno'].cli).toBe(expected)
    })
  })
})