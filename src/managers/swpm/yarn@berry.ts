import type { PackageConfiguration } from '../../types/packages.types.js'

const yarnBerry: PackageConfiguration = {
  cmd: 'yarn@berry',
  exc: 'yarn dlx',
  color: '#2c8ebb',
  url: 'https://yarnpkg.com/',
  semver: '>=2.0.0',
  lockFiles: ['yarn.lock'],
  modulesPath: ['.yarn/cache', '.pnp.cjs', '.pnp.js'],
  modulesFile: ['.pnp.cjs', '.pnp.js'],
  logFile: 'yarn-error.log',
  install: 'yarn global add sxpm',
  cmds: {
    upgrade: ['add', '--latest'],
    ug: ['add', '--latest'],
    interactive: ['upgrade', '--interactive'],
    ui: ['upgrade', '--interactive']
  },
  args: {
    '--frozen': '--immutable',
    '--package-lock': ['', -1],
    '-P': ['', -1]
  }
}

export default yarnBerry
