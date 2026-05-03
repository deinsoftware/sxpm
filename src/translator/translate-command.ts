import type { PackageManagerList } from '../types/packages.types.js'
import { getPackageConfig } from '../managers/index.js'

export type TranslateCommandParams = {
  command: string
  args: string[]
  targetPM: PackageManagerList
}

export type TranslateCommandResult = {
  command: string
  args: string[]
}

const replaceCommand = (args: string[], oldCmd: string, newCmd: string): void => {
  const index = args?.findIndex((arg) => arg === oldCmd)
  if (index !== -1) {
    args[index] = newCmd
  }
}

const addArgs = (args: string[], flags: (string | number)[]): void => {
  const textFlags = flags.map(flag => flag.toString())
  args.push(...textFlags)
}

export function translateCommand(params: TranslateCommandParams): TranslateCommandResult {
  const { command, args, targetPM } = params
  const config = getPackageConfig(targetPM)

  if (!config) {
    return { command, args: [...args] }
  }

  const action = config.cmds[command]

  if (typeof action === 'string') {
    // Simple string replacement
    const newArgs = [...args]
    replaceCommand(newArgs, command, action)
    return { command: action, args: newArgs }
  }

  if (Array.isArray(action)) {
    const [newCommand, ...rest] = action

    // If rest[0] is -1, the command is not supported
    if (rest[0] === -1) {
      throw new Error(`The ${command} command is not available on ${targetPM}`)
    }

    const newArgs = [...args]
    replaceCommand(newArgs, command, newCommand)
    addArgs(newArgs, rest)
    return { command: newCommand, args: newArgs }
  }

  // If action is an object (positional), handle it
  if (typeof action === 'object' && action !== null && !Array.isArray(action)) {
    const newArgs = [...args]
    const key = Object.keys(action)[0] ?? ''
    const value = action[key] ?? ''

    const start = newArgs?.findIndex((arg) => arg.startsWith(key))
    if (typeof value === 'string' && start > 0) {
      newArgs.splice(start, 0, value)
    }

    return { command, args: newArgs }
  }

  // No translation needed, return as-is
  return { command, args: [...args] }
}
