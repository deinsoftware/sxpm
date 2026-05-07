import type { PackageManagerList } from './packages.types.js'

export type TranslateArgsParams = {
    args: string[]
    packageManagers: PackageManagerList[]
    command?: string
    packageName?: string
}

export type TranslateArgsResult = {
    [packageManager: string]: {
        args: string[]
        error?: string
    }
}