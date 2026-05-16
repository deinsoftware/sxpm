import type { PackageManagerList } from './packages.types.js'

export type TranslateArgsParams = {
    args: string[]
    packageManagers: PackageManagerList[]
    command?: string
    packageName?: string
    /** @default 'swpm' — currently only swpm dictionaries exist; future: any PackageManagerList */
    from?: PackageManagerList
}

export type TranslateArgsResult = {
    [packageManager: string]: {
        args: string[]
        error?: string
    }
}