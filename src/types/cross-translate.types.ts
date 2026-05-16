import type { PackageManagerList } from './packages.types.js'

export type CrossTranslateParams = {
    command: string
    args: string[]
    packageManagers: PackageManagerList[]
    packageName?: string
    /** @default 'swpm' — currently only swpm dictionaries exist; future: any PackageManagerList */
    from?: PackageManagerList
}

export type CrossTranslateResult = {
    [packageManager: string]: {
        command: string
        args: string[]
        cli: string
        error?: string
    }
}