import type { PackageConfiguration, PackageManagerList } from '../types/packages.types.js'

import npm from './npm.js'
import pnpm from './pnpm.js'
import yarn from './yarn.js'
import yarnBerry from './yarn@berry.js'
import bun from './bun.js'
import deno from './deno.js'

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

export const getPackageConfig = (cmd: PackageManagerList): PackageConfiguration | undefined => {
  return packagesList.find(pkg => pkg.cmd === cmd)
}

export const availablePackages = (): PackageManagerList[] => {
  return packagesList.map(pkg => pkg.cmd as PackageManagerList)
}
