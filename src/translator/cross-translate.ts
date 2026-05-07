import { translateCommand } from './translate-command.js'
import { translateArgs } from './translate-args.js'
import { availablePackages } from '../managers/index.js'
import type { CrossTranslateParams, CrossTranslateResult } from '../types/cross-translate.types.js'

export function crossTranslate(params: CrossTranslateParams): CrossTranslateResult {
  const { command, args, packageManagers, packageName } = params

  const targets = packageManagers.length === 0
    ? availablePackages()
    : packageManagers

  const cmdResult = translateCommand({
    command,
    args,
    packageManagers: targets,
    packageName
  })

  const argsResult = translateArgs({
    args,
    packageManagers: targets,
    command,
    packageName
  })

  const result: CrossTranslateResult = {}

  for (const pm of targets) {
    const cmd = cmdResult[pm]
    const arg = argsResult[pm]

    if (!cmd || !arg) continue

    if (cmd.error) {
      result[pm] = {
        command: cmd.command,
        args: arg.args,
        cli: '',
        error: cmd.error
      }
      continue
    }

    result[pm] = {
      command: cmd.command,
      args: arg.args,
      cli: `${pm} ${cmd.command} ${arg.args.join(' ')}`.trim()
    }
  }

  return result
}