import type { PackageManagerList } from '../types/packages.types.js'
import { getPackageConfig, availablePackages } from '../managers/index.js'
import type { TranslateArgsParams, TranslateArgsResult } from '../types/translate-args.types.js'

const findFlagIndex = (args: string[], flag: string): number => {
  return args?.findIndex((arg) => arg === flag)
}

const replaceFlag = (args: string[], flag: string, newFlag: string): void => {
  const index = findFlagIndex(args, flag)
  if (index !== -1) {
    args[index] = newFlag
  }
}

const removeFlagAndValue = (args: string[], flag: string, valueIsBoolean: boolean): void => {
  const index = findFlagIndex(args, flag)
  if (index === -1) return

  let places = 1
  if (!valueIsBoolean) {
    places = 2
  }

  args.splice(index, places)
}

const moveFlag = (args: string[], argConfig: [string, number], packageName?: string): void => {
  const [action, start] = argConfig

  if (start === -1) {
    return
  }

  let count = 0
  let finalAction = action

  if (packageName && action.includes('<package>')) {
    count = 1
    finalAction = action.replace('<package>', packageName)
  }

  if (start >= 0 && start < args.length) {
    args.splice(start, count, finalAction)
  }
}

const translateSingleArgs = (
  args: string[],
  targetPM: PackageManagerList,
  command?: string,
  packageName?: string
): TranslateArgsResult[string] => {
  const pmParts = targetPM.split('@')
  const basePM = pmParts[0]
  const version = pmParts[1]

  const config = getPackageConfig(basePM as PackageManagerList, version)

  if (!config) {
    const versionMsg = version ? ` ${version}` : ''
    return {
      args: [...args],
      error: `Package manager${versionMsg} not supported`
    }
  }

  const newArgs = [...args]

  for (const flag of [...newArgs]) {
    const action = config.args[flag]

    if (action === undefined) continue

    if (typeof action === 'string') {
      replaceFlag(newArgs, flag, action)
    } else if (Array.isArray(action)) {
      removeFlagAndValue(newArgs, flag, false)
      moveFlag(newArgs, action as [string, number], packageName)
    } else if (typeof action === 'object' && action !== null && !Array.isArray(action)) {
      removeFlagAndValue(newArgs, flag, true)
      if (command && command in action) {
        const newCommand = action[command]
        if (typeof newCommand === 'string') {
          const cmdIndex = newArgs.findIndex(arg => arg === command)
          if (cmdIndex !== -1) {
            newArgs[cmdIndex] = newCommand
          }
        }
      }
    }
  }

  return { args: newArgs }
}

export function translateArgs(params: TranslateArgsParams): TranslateArgsResult {
  const { args, packageManagers, command, packageName } = params

  const targets = packageManagers.length === 0
    ? availablePackages()
    : packageManagers

  const result: TranslateArgsResult = {}

  for (const pm of targets) {
    const translation = translateSingleArgs(args, pm, command, packageName)
    result[pm] = translation
  }

  return result
}

export const cleanFlag = (args: string[], flag: string, hasValue: boolean = false): void => {
  const index = findFlagIndex(args, flag)
  if (index === -1) return

  let places = 1
  if (hasValue) {
    places = 2
  }

  args.splice(index, places)
}
