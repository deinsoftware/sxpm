import type { PackageConfiguration, PackageManagerList } from '../types/packages.types.js'
import semver from 'semver'

import swpmPackages from './swpm/index.js'

type DictionarySource = 'swpm'

const dictionaries: Record<DictionarySource, PackageConfiguration[]> = {
  swpm: swpmPackages
}

function getPackages(from: string = 'swpm'): PackageConfiguration[] {
  return dictionaries[from as DictionarySource] ?? dictionaries.swpm
}

export default dictionaries.swpm

export const packageExists = (
  cmd: string,
  from: string = 'swpm'
): cmd is PackageManagerList => {
  return getPackages(from).some(pkg => pkg.cmd === cmd)
}

export const getPackageConfig = (
  pm: PackageManagerList,
  version?: string,
  from: string = 'swpm'
): PackageConfiguration | undefined => {
  const packagesList = getPackages(from)
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

export const availablePackages = (from: string = 'swpm'): PackageManagerList[] => {
  return getPackages(from).map(pkg => pkg.cmd as PackageManagerList)
}