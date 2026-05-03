import type { PackageConfiguration, PackageManagerList } from './packages.types.js'
import type { PackageJson as BasePackageJson } from 'type-fest'

export type CommanderPackage = {
    cmd?: PackageManagerList
    args: string[]
    origin?: 'pinned' | 'packageManager' | 'environment' | 'lock'
    config?: PackageConfiguration
    volta?: boolean
}

export type PackageJson = BasePackageJson & {
    sxpm?: string
    packageManager?: string
    volta?: {
        [key: string]: string
    }
}
