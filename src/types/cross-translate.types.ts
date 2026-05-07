import type { PackageManagerList } from './packages.types.js'

export type CrossTranslateParams = {
    command: string
    args: string[]
    packageManagers: PackageManagerList[]
    packageName?: string
}

export type CrossTranslateResult = {
    [packageManager: string]: {
        command: string
        args: string[]
        cli: string
        error?: string
    }
}