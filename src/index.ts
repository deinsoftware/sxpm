// Public API for sxpm (Switch Cross Package Manager)
// ONLY translation logic + configurations

// Re-export types
export type { PackageManagerList, PackageConfiguration } from './types/packages.types.js'
export type { TranslateCommandParams, TranslateCommandResult } from './translator/translate-command.js'
export type { TranslateArgsParams, TranslateArgsResult } from './translator/translate-args.js'

// Re-export functions (ONLY translation related)
export { translateCommand } from './translator/translate-command.js'
export { translateArgs, cleanFlag } from './translator/translate-args.js'
export { getPackageConfig, packageExists, availablePackages } from './managers/index.js'

// Utilities needed by sxpm
export { findUp } from 'find-up'
export { default as semver } from 'semver'
