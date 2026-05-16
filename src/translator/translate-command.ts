import type { PackageManagerList } from '../types/packages.types.js'
import { getPackageConfig, availablePackages } from '../managers/index.js'
import type { TranslateCommandParams, TranslateCommandResult } from '../types/translate-command.types.js'

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

const translateSingle = (
  command: string,
  args: string[],
  targetPM: PackageManagerList,
  packageName?: string,
  from: string = 'swpm'
): TranslateCommandResult[string] => {
  const pmParts = targetPM.split('@')
  const basePM = pmParts[0]
  const version = pmParts[1]

  const config = getPackageConfig(basePM as PackageManagerList, version, from)

  if (!config) {
    const versionMsg = version ? ` ${version}` : ''
    return {
      command,
      args: [...args],
      cli: '',
      error: `Package manager${versionMsg} not supported`
    }
  }

  const action = config.cmds[command]
  let newCommand = command
  const newArgs = [...args]

  if (typeof action === 'string') {
    replaceCommand(newArgs, command, action)
    newCommand = action
  } else if (Array.isArray(action)) {
    const [cmd, ...rest] = action

    if (rest[0] === -1) {
      return {
        command,
        args: [...args],
        cli: '',
        error: `Command '${command}' not available on ${config.cmd}`
      }
    }

    replaceCommand(newArgs, command, cmd)
    addArgs(newArgs, rest)
    newCommand = cmd
  } else if (typeof action === 'object' && action !== null && !Array.isArray(action)) {
    const key = Object.keys(action)[0] ?? ''
    const value = action[key] ?? ''

    const start = newArgs?.findIndex((arg) => arg.startsWith(key))
    if (typeof value === 'string' && start > 0) {
      newArgs.splice(start, 0, value)
    }
  }

  if (packageName) {
    for (let i = 0; i < newArgs.length; i++) {
      if (newArgs[i].includes('<package>')) {
        newArgs[i] = newArgs[i].replace('<package>', packageName)
      }
    }
  }

  const cli = [config.cmd, newCommand, ...newArgs].join(' ')

  return {
    command: newCommand,
    args: newArgs,
    cli
  }
}

export function translateCommand(
  params: TranslateCommandParams
): TranslateCommandResult {
  const { command, args, packageManagers, packageName, from = 'swpm' } = params

  const targets = packageManagers.length === 0
    ? availablePackages(from)
    : packageManagers

  const result: TranslateCommandResult = {}

  for (const pm of targets) {
    const translation = translateSingle(command, args, pm, packageName, from)
    result[pm] = translation
  }

  return result
}