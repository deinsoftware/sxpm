import type { PackageConfiguration } from '../../types/packages.types.js'
import npm from './npm.js'
import pnpm from './pnpm.js'
import yarn from './yarn.js'
import yarnBerry from './yarn@berry.js'
import bun from './bun.js'
import deno from './deno.js'

const packages: PackageConfiguration[] = [npm, pnpm, yarn, yarnBerry, bun, deno]

export default packages
export { npm, pnpm, yarn, yarnBerry, bun, deno }
