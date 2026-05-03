import type { PackageManagerList } from '../types/packages.types.js'
import { getPackageConfig } from '../managers/index.js'

export type TranslateArgsParams = {
  args: string[]
  targetPM: PackageManagerList
  command?: string
}

export type TranslateArgsResult = {
  args: string[]
}

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
    // Flag not supported, remove it
    return
  }

  let count = 0
  let finalAction = action

  if (packageName && action.includes('<package>')) {
    count = 1
    finalAction = action.replace('<package>', packageName)
  }

  // Si start es 0, poner al principio; si es 1, después del comando; etc.
  if (start >= 0 && start < args.length) {
    args.splice(start, count, finalAction)
  }
}

export function translateArgs(params: TranslateArgsParams): TranslateArgsResult {
  const { args, targetPM, command } = params
  const config = getPackageConfig(targetPM)

  if (!config) {
    return { args: [...args] }
  }

  const newArgs = [...args]

  for (const flag of [...newArgs]) {
    const action = config.args[flag]

    if (action === undefined) continue

    if (typeof action === 'string') {
      replaceFlag(newArgs, flag, action)
    } else if (Array.isArray(action)) {
      removeFlagAndValue(newArgs, flag, false)
      moveFlag(newArgs, action as [string, number])
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

// cleanFlag para uso CLI (elimina flag de los args)
export const cleanFlag = (args: string[], flag: string, hasValue: boolean = false): void => {
  const index = findFlagIndex(args, flag)
  if (index === -1) return

  let places = 1
  if (hasValue) {
    places = 2
  }

  args.splice(index, places)
}
