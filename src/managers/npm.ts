import type { PackageConfiguration } from '../types/packages.types.js'

const npm: PackageConfiguration = {
  cmd: 'npm',
  exc: 'npx',
  color: '#e32e37',
  url: 'https://www.npmjs.com/',
  semver: '',
  lockFiles: ['package-lock.json'],
  modulesPath: [],
  modulesFile: [],
  logFile: 'npm-debug.log',
  install: 'npm install sxpm --global',
  cmds: {
    add: 'install',
    remove: 'uninstall',
    r: 'uninstall',
    rm: 'uninstall',
    un: 'uninstall',
    up: 'update',
    ud: 'update',
    upgrade: ['add', '<package>@latest'],
    ug: ['add', '<package>@latest'],
    interactive: ['', -1],
    clean: ['cache', 'clean'],
    run: { '--': '--' },
    create: { '--': '--' }
  },
  args: {
    '--frozen': {
      i: 'ci',
      install: 'ci'
    },
    '-F': {
      i: 'ci',
      install: 'ci'
    },
    '--latest': ['<package>@latest', 1],
    '-L': ['<package>@latest', 1],
    '--package-lock': '--no-package-lock',
    '-P': '--no-package-lock'
  }
}

export default npm
