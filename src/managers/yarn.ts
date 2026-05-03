import type { PackageConfiguration } from '../types/packages.types.js'

const yarn: PackageConfiguration = {
  cmd: 'yarn',
  exc: 'yarn dlx',
  color: '#2c8ebb',
  url: 'https://yarnpkg.com/',
  semver: '',
  lockFiles: ['yarn.lock'],
  modulesPath: ['node_modules'],
  modulesFile: [],
  logFile: 'yarn-error.log',
  install: 'yarn global add sxpm',
  cmds: {
    clean: ['cache', 'clean'],
    upgrade: ['add', '--latest'],
    ug: ['add', '--latest'],
    interactive: ['upgrade', '--interactive'],
    ui: ['upgrade', '--interactive']
  },
  args: {
    '--frozen': '--frozen-lockfile',
    '--package-lock': ['', -1],
    '-P': ['', -1]
  }
}

export default yarn
