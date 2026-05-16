import type { PackageConfiguration, PackageManagerList } from '../types/packages.types.js'
import semver from 'semver'

import npm from './swpm/npm.js'
import pnpm from './swpm/pnpm.js'
import yarn from './swpm/yarn.js'
import yarnBerry from './swpm/yarn@berry.js'
import bun from './swpm/bun.js'
import deno from './swpm/deno.js'

const packagesList: PackageConfiguration[] = [
  npm,
  pnpm,
  yarn,
  yarnBerry,
  bun,
  deno
]

export default packagesList

export const packageExists = (cmd: string): cmd is PackageManagerList => {
  return packagesList.some(pkg => pkg.cmd === cmd)
}

export const getPackageConfig = (
  pm: PackageManagerList,
  version?: string
): PackageConfiguration | undefined => {
  const base = pm.split('@')[0]
  const requestedVersion = version || pm.split('@')[1]

  if (!requestedVersion) {
    return packagesList.find(pkg => pkg.cmd === pm)
  }

  const matched = packagesList.find(pkg => {
    if (pkg.cmd.startsWith(base)) {
      if (!pkg.semver) return true
      return semver.satisfies(requestedVersion, pkg.semver)
    }
    return false
  })

  return matched
}

export const availablePackages = (): PackageManagerList[] => {
  return packagesList.map(pkg => pkg.cmd as PackageManagerList)
}