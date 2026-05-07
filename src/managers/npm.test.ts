import { describe, it, expect } from 'vitest'
import { translateCommand } from 'sxpm'

describe('npm: package commands', () => {
  const cases = [
    { cmd: 'install', args: [], expected: 'npm install' },
    { cmd: 'install', args: ['--package-lock'], expected: 'npm install --package-lock' },
    { cmd: 'install', args: ['--frozen'], expected: 'npm install --frozen' },
    { cmd: 'clean', args: [], expected: 'npm cache clean' },
    { cmd: 'add', args: ['react'], expected: 'npm install react' },
    { cmd: 'add', args: ['react', '--global'], expected: 'npm install react --global' },
    { cmd: 'add', args: ['react', '--save-dev'], expected: 'npm install react --save-dev' },
    { cmd: 'add', args: ['react', '--save-optional'], expected: 'npm install react --save-optional' },
    { cmd: 'add', args: ['react', '--save-peer'], expected: 'npm install react --save-peer' },
    { cmd: 'add', args: ['react', '--save-exact'], expected: 'npm install react --save-exact' },
    { cmd: 'remove', args: ['react'], expected: 'npm uninstall react' },
    { cmd: 'remove', args: ['react', '--save-dev'], expected: 'npm uninstall react --save-dev' },
    { cmd: 'remove', args: ['react', '--save-optional'], expected: 'npm uninstall react --save-optional' },
    { cmd: 'remove', args: ['react', '--save-peer'], expected: 'npm uninstall react --save-peer' },
    { cmd: 'remove', args: ['react', '--global'], expected: 'npm uninstall react --global' },
    { cmd: 'update', args: ['react'], expected: 'npm update react' },
    { cmd: 'update', args: ['react', '--global'], expected: 'npm update react --global' },
    { cmd: 'upgrade', args: ['react'], expected: 'npm add react <package>@latest' },
    { cmd: 'upgrade', args: ['react', '--global'], expected: 'npm add react --global <package>@latest' },
    { cmd: 'interactive', args: [], expected: 'invalid' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      if (expected === 'invalid') {
        expect(result['npm'].error).toBeDefined()
      } else {
        expect(result['npm'].cli).toBe(expected)
      }
    })
  })
})

describe('npm: shared commands', () => {
  const cases = [
    { cmd: 'init', args: [], expected: 'npm init' },
    { cmd: 'login', args: [], expected: 'npm login' },
    { cmd: 'logout', args: [], expected: 'npm logout' },
    { cmd: 'run', args: ['build'], expected: 'npm run build' },
    { cmd: 'test', args: [], expected: 'npm test' },
    { cmd: 'build', args: [], expected: 'npm build' },
    { cmd: 'publish', args: [], expected: 'npm publish' },
    { cmd: 'unpublish', args: ['pkg'], expected: 'npm unpublish pkg' },
    { cmd: 'unpublish', args: ['pkg@1.0.0'], expected: 'npm unpublish pkg@1.0.0' },
    { cmd: 'deprecate', args: ['pkg', 'message'], expected: 'npm deprecate pkg message' },
    { cmd: 'deprecate', args: ['pkg@1.0.0', 'message'], expected: 'npm deprecate pkg@1.0.0 message' },
    { cmd: 'config', args: ['list'], expected: 'npm config list' },
    { cmd: 'config', args: ['set', 'save-exact', 'true'], expected: 'npm config set save-exact true' },
    { cmd: 'config', args: ['set', 'save-prefix', '~'], expected: 'npm config set save-prefix ~' },
    { cmd: 'outdated', args: [], expected: 'npm outdated' },
    { cmd: 'outdated', args: ['react'], expected: 'npm outdated react' },
    { cmd: 'outdated', args: ['--global'], expected: 'npm outdated --global' },
    { cmd: 'link', args: [], expected: 'npm link' },
    { cmd: 'link', args: ['folder'], expected: 'npm link folder' },
    { cmd: 'unlink', args: [], expected: 'npm unlink' }
  ]

  cases.forEach(({ cmd, args, expected }) => {
    it(`${cmd} ${args.join(' ')}`, () => {
      const result = translateCommand({ command: cmd, args, packageManagers: [] })
      expect(result['npm'].cli).toBe(expected)
    })
  })
})

describe('npm: run remotely', () => {
  it('run package', () => {
    const result = translateCommand({ command: 'run', args: ['pkg'], packageManagers: ['npm'] })
    expect(result['npm'].cli).toBe('npm run pkg')
  })
})