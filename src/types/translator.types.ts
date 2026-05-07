import type { PackageManagerList } from './packages.types.js'

export type TranslateCommandParams = {
    command: string
    args: string[]
    packageManagers: PackageManagerList[]
}

export type TranslateCommandResult = {
    [packageManager: string]: {
        command: string
        args: string[]
        cli: string
        error?: string
    }
}

export type TranslateArgsParams = {
    args: string[]
    packageManagers: PackageManagerList[]
    command?: string
}

export type TranslateArgsResult = {
    [packageManager: string]: {
        args: string[]
        error?: string
    }
}