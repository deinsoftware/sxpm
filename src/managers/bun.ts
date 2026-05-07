import type { PackageConfiguration } from '../types/packages.types.js'

const bun: PackageConfiguration = {
  cmd: 'bun',
  exc: 'bunx',
  color: '#fbf0df',
  url: 'https://bun.sh/',
  semver: '',
  lockFiles: ['bun.lockb', 'bun.lock'],
  modulesPath: ['node_modules'],
  modulesFile: [],
  logFile: 'bun-error.log',
  install: 'bun install sxpm --global',
  cmds: {
    upgrade: ['add', '--latest'],
    ug: ['add', '--latest'],
    interactive: ['', -1],
    clean: ['pm', 'cache', 'rm'],
    unlink: ['remove', '--global'],
    link: ['add', '--global']
  },
  args: {
    '--frozen': ['', -1],
    '--package-lock': ['', -1],
    '-P': ['', -1]
  }
}

export default bun
