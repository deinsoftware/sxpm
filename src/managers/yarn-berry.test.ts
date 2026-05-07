import { describe, it, expect } from 'vitest'
import { translateCommand } from 'sxpm'

describe('yarn@berry: package commands', () => {
  const cases = [
    { cmd: 'install', args: [], expected: 'yarn install' },
    { cmd: 'install', args: ['--no-lockfile'], expected: 'yarn install --no-lockfile' },
    { cmd: 'install', args: ['--frozen'], expected: 'yarn install --frozen' },
    { cmd: 'add', args: ['react'], expected: 'yarn add react' },
    { cmd: 'add', args: ['react', '--global'], expected: 'yarn add react --global' },
    { cmd: 'add', args: ['react', '--save-dev'], expected: 'yarn add react --save-dev' },
    { cmd: 'add', args: ['react', '--save-optional'], expected: 'yarn add react --save-optional' },
    { cmd: 'add', args: ['react', '--save-peer'], expected: 'yarn add react --save-peer' },
    { cmd: 'add', args: ['react', '--save-exact'], expected: 'yarn add react --save-exact' },
    { cmd: 'remove', args: ['react'], expected: 'yarn remove react' },
    { cmd: 'remove', args: ['react', '--save-dev'], expected: 'yarn remove react --save-dev' },
    { cmd: 'remove', args: ['react', '--save-optional'], expected: 'yarn remove react --save-optional' },
    { cmd: 'remove', args: ['react', '--save-peer'], expected: 'yarn remove react --save-peer' },
    { cmd: 'remove', args: ['react', '--global'], expected: 'yarn remove react --global' },
    { cmd: 'update', args: ['react'], expected: 'yarn update react' },
    { cmd: 'upgrade', args: ['react'], expected: 'yarn upgrade react' },
    { cmd: 'upgrade', args: ['react', '--global'], expected: 'yarn upgrade react --global' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['yarn@berry'].cli).toBe(expected)
    })
  })
})

describe('yarn@berry: shared commands', () => {
  const cases = [
    { cmd: 'init', args: [], expected: 'yarn init' },
    { cmd: 'login', args: [], expected: 'yarn login' },
    { cmd: 'logout', args: [], expected: 'yarn logout' },
    { cmd: 'run', args: ['build'], expected: 'yarn run build' },
    { cmd: 'test', args: [], expected: 'yarn test' },
    { cmd: 'build', args: [], expected: 'yarn build' },
    { cmd: 'publish', args: [], expected: 'yarn publish' },
    { cmd: 'unpublish', args: ['pkg'], expected: 'yarn unpublish pkg' },
    { cmd: 'unpublish', args: ['pkg@1.0.0'], expected: 'yarn unpublish pkg@1.0.0' },
    { cmd: 'deprecate', args: ['pkg', 'message'], expected: 'yarn deprecate pkg message' },
    { cmd: 'config', args: ['list'], expected: 'yarn config list' },
    { cmd: 'config', args: ['set', 'save-exact', 'true'], expected: 'yarn config set save-exact true' },
    { cmd: 'config', args: ['set', 'save-prefix', '~'], expected: 'yarn config set save-prefix ~' },
    { cmd: 'outdated', args: [], expected: 'yarn outdated' },
    { cmd: 'outdated', args: ['react'], expected: 'yarn outdated react' },
    { cmd: 'link', args: [], expected: 'yarn link' },
    { cmd: 'link', args: ['folder'], expected: 'yarn link folder' },
    { cmd: 'unlink', args: [], expected: 'yarn unlink' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['yarn@berry'].cli).toBe(expected)
    })
  })
})