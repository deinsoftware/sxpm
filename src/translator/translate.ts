import { translateCommand } from './translate-command.js'
import { translateArgs } from './translate-args.js'
import type { TranslateParams, TranslateResult } from '../types/translator.types.js'

export function translate(params: TranslateParams): TranslateResult {
    const { command, args, packageManagers, packageName } = params

    const cmdResult = translateCommand({
        command,
        args,
        packageManagers,
        packageName
    })

    const argsResult = translateArgs({
        args,
        packageManagers,
        command,
        packageName
    })

    const result: TranslateResult = {}

    for (const pm of packageManagers) {
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