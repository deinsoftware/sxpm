import type { PackageConfiguration } from '../../types/packages.types.js'

const pnpm: PackageConfiguration = {
  cmd: 'pnpm',
  exc: 'pnpm dlx',
  color: '#f7ad24',
  url: 'https://pnpm.io/',
  semver: '',
  lockFiles: ['pnpm-lock.yaml'],
  modulesPath: [],
  modulesFile: [],
  logFile: 'pnpm-debug.log',
  install: 'pnpm install sxpm --global',
  cmds: {
    remove: 'uninstall',
    r: 'uninstall',
    rm: 'uninstall',
    un: 'uninstall',
    up: 'update',
    ud: 'update',
    upgrade: ['update', '--latest'],
    ug: ['update', '--latest'],
    interactive: ['upgrade', '--interactive'],
    ui: ['upgrade', '--interactive'],
    clean: ['', -1]
  },
  args: {
    '--frozen': '--frozen-lockfile',
    '--package-lock': ['', -1],
    '-P': ['', -1]
  }
}

export default pnpm
