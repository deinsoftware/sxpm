# sxpm (Switch Cross Package Manager)

[![build](https://github.com/deinsoftware/sxpm/actions/workflows/build.yml/badge.svg)](https://github.com/deinsoftware/sxpm/actions/workflows/build.yml)
[![npm-version](https://img.shields.io/npm/v/sxpm.svg?color=blue)](https://www.npmjs.com/package/sxpm)
[![npm-downloads](https://img.shields.io/npm/dt/sxpm)](https://www.npmjs.com/package/sxpm)
[![node-engine](https://img.shields.io/node/v/sxpm.svg?color=blue)](https://nodejs.org)
[![types](https://img.shields.io/npm/types/sxpm.svg?color=blue)](https://www.npmjs.com/package/sxpm)
[![license](https://img.shields.io/github/license/deinsoftware/sxpm)](LICENSE.md)

![sxpm](https://raw.githubusercontent.com/deinsoftware/sxpm/main/.github/social/preview.png)

---

## Menu

- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Usage](#usage)
  - [Translate Command](#translate-command)
  - [Translate Arguments](#translate-arguments)
  - [Handle Errors](#handle-errors)
- [API](#api)
  - [translateCommand](#translatecommandparams-translatecommandresult)
  - [translateArgs](#translateargsparams-translateargsresult)
  - [cleanFlag](#cleanflagargs-flag-hasvalue-void)
  - [getPackageConfig](#getpackageconfigcmd-version-packageconfiguration--undefined)
  - [packageExists](#packageexistscmd-boolean)
  - [availablePackages](#availablepackages-packagemanagerlist)
- [Supported Package Managers](#supported-package-managers)
- [FAQ](#faq)
- [About](#about)

---

## Getting Started

`sxpm` is a library that translates package manager commands between different Node.js package managers. It provides a unified API to convert commands and arguments between npm, yarn (classic and berry), pnpm, bun, and deno.

> **Note**:  
> This is a core translation engine. For CLI commands, check [swpm](https://github.com/deinsoftware/swpm).

### Installation

Install with any package manager:

| Package Manager | Install Command              |
| --------------- | ---------------------------- |
| **npm**         | `npm install sxpm`           |
| **yarn**        | `yarn add sxpm`              |
| **pnpm**        | `pnpm add sxpm`              |
| **bun**         | `bun add sxpm`               |

⇧ [Back to menu](#menu)

---

## Usage

### Translate Command

Translate a command to one or more package managers.

```typescript
import { translateCommand } from 'sxpm'

const result = translateCommand({
  command: 'remove',
  args: ['react'],
  packageManagers: ['npm', 'pnpm']
})

console.log(result)
// {
//   npm: { command: 'uninstall', args: ['react'], cli: 'npm uninstall react' },
//   pnpm: { command: 'uninstall', args: ['react'], cli: 'pnpm uninstall react' }
// }
```

#### Translate to All Available Package Managers

```typescript
const result = translateCommand({
  command: 'add',
  args: ['react'],
  packageManagers: []  // empty array returns all
})
```

#### Translate with Specific Version

```typescript
const result = translateCommand({
  command: 'upgrade',
  args: ['react'],
  packageManagers: ['yarn@berry']  // use yarn@berry config
})
```

#### Translate with Package Name

When you need to replace `<package>` placeholder with actual package name:

```typescript
const result = translateCommand({
  command: 'upgrade',
  args: ['react'],
  packageManagers: ['npm'],
  packageName: 'react'
})

// npm: { command: 'add', args: ['react', 'react@latest'], cli: 'npm add react react@latest' }
```

⇧ [Back to menu](#menu)

---

### Translate Arguments

Translate arguments between package managers.

```typescript
import { translateArgs } from 'sxpm'

const result = translateArgs({
  args: ['--frozen'],
  packageManagers: ['pnpm', 'yarn']
})

console.log(result)
// {
//   pnpm: { args: ['--frozen-lockfile'] },
//   yarn: { args: ['--frozen-lockfile'] }
// }
```

#### With Package Name

```typescript
const result = translateArgs({
  args: ['upgrade', 'react', '--latest'],
  packageManagers: ['npm'],
  command: 'upgrade',
  packageName: 'react'
})

// npm: { args: ['upgrade', 'react', 'react@latest'] }
```

⇧ [Back to menu](#menu)

---

### Handle Errors

Handle commands that are not available on certain package managers.

```typescript
const result = translateCommand({
  command: 'interactive',
  args: [],
  packageManagers: ['npm', 'pnpm']
})

console.log(result)
// {
//   npm: { command: 'interactive', args: [], cli: '', error: "Command 'interactive' not available on npm" },
//   pnpm: { command: 'interactive', args: [], cli: 'pnpm interactive' }
// }
```

⇧ [Back to menu](#menu)

---

## API

### `translateCommand(params): TranslateCommandResult`

Translates a command from sxpm to one or more package managers.

**Params:**

| Param             | Type                  | Description                                                    |
| ----------------- | --------------------- | -------------------------------------------------------------- |
| `command`         | `string`              | The sxpm command to translate                                   |
| `args`            | `string[]`            | Arguments for the command                                     |
| `packageManagers` | `PackageManagerList[]` | Target package managers (empty = all)                          |
| `packageName`     | `string` (optional)   | Package name to replace `<package>` placeholder                    |

**Returns:** `TranslateCommandResult`

```typescript
interface TranslateCommandResult {
  [packageManager: string]: {
    command: string
    args: string[]
    cli: string
    error?: string
  }
}
```

| Property        | Type     | Description                           |
| --------------- | -------- | ------------------------------------ |
| `command`       | `string` | Translated command                 |
| `args`          | `string[]` | Translated arguments              |
| `cli`           | `string` | Full CLI command string              |
| `error`         | `string` (optional) | Error message if not available |

⇧ [Back to menu](#menu)

---

### `translateArgs(params): TranslateArgsResult`

Translates arguments between package managers.

**Params:**

| Param             | Type                  | Description                                                    |
| ----------------- | --------------------- | -------------------------------------------------------------- |
| `args`            | `string[]`            | Arguments to translate                                          |
| `packageManagers` | `PackageManagerList[]` | Target package managers                                       |
| `command`        | `string` (optional)  | Parent command context                                        |
| `packageName`     | `string` (optional)  | Package name to replace `<package>` placeholder                    |

**Returns:** `TranslateArgsResult`

```typescript
interface TranslateArgsResult {
  [packageManager: string]: {
    args: string[]
    error?: string
  }
}
```

⇧ [Back to menu](#menu)

---

### `cleanFlag(args, flag, hasValue): void`

Removes a flag from args array.

```typescript
import { cleanFlag } from 'sxpm'

const args = ['install', '--frozen', '--verbose']
cleanFlag(args, '--frozen')

console.log(args)
// ['install', '--verbose']
```

**Params:**

| Param      | Type      | Description                              |
| ---------- | ---------- | ---------------------------------------- |
| `args`     | `string[]` | Arguments array to modify (by reference) |
| `flag`     | `string`   | Flag to remove                           |
| `hasValue` | `boolean` | Whether flag has a value (default: false) |

⇧ [Back to menu](#menu)

---

### `getPackageConfig(cmd, version?): PackageConfiguration | undefined`

Gets the configuration for a specific package manager.

```typescript
import { getPackageConfig } from 'sxpm'

const config = getPackageConfig('npm')
console.log(config?.cmd)
// 'npm'
```

**Params:**

| Param   | Type     | Description                    |
| ------- | -------- | ------------------------------ |
| `cmd`   | `PackageManagerList` | Package manager |
| `version` | `string` (optional) | Specific version |

⇧ [Back to menu](#menu)

---

### `packageExists(cmd): boolean`

Checks if a package manager is supported.

```typescript
import { packageExists } from 'sxpm'

console.log(packageExists('npm'))
// true
console.log(packageExists('deno'))
// true
console.log(packageExists('invalid'))
// false
```

⇧ [Back to menu](#menu)

---

### `availablePackages(): PackageManagerList[]`

Returns list of all supported package managers.

```typescript
import { availablePackages } from 'sxpm'

console.log(availablePackages())
// ['npm', 'yarn', 'yarn@berry', 'pnpm', 'bun', 'deno']
```

⇧ [Back to menu](#menu)

---

## Supported Package Managers

| Manager      | Version     | Lock File        |
| ------------ | ------------ | --------------- |
| **npm**      | 7+          | `package-lock.json` |
| **yarn**     | Classic     | `yarn.lock`    |
| **yarn@berry** | 2+ (Berry) | `yarn.lock`    |
| **pnpm**     | 7+         | `pnpm-lock.yaml` |
| **bun**      | 1+         | `bun.lock`     |
| **deno**     | 2.0+       | `deno.lock`    |

---

## FAQ

### What's the difference between sxpm and swpm?

- **sxpm**: Core translation engine library (this package)
- **swpm**: CLI tool that uses sxpm for translations

### How do I add support for a new package manager?

1. Add configuration in `src/managers/<pm>.ts`
2. Include in `src/managers/index.ts`
3. Add tests in `src/managers/<pm>.test.ts`

### Can I use sxpm in the browser?

No, sxpm is a Node.js library. It requires Node.js 20+.

⇧ [Back to menu](#menu)

---

## About

### Built With

- [TypeScript](https://www.typescriptlang.org/) - JavaScript With Syntax For Types.
- [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [vitest](https://vitest.dev/) - A blazing fast unit-test framework powered by Vite.
- [ESLint](https://eslint.org/) - Find and fix problems in your JavaScript code.

### NPM Packages

- [semver](https://www.npmjs.com/package/semver) - The semantic versioner for npm.

### Contributing

Please read [CONTRIBUTING](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [sxpm](https://github.com/deinsoftware/sxpm/tags) on GitHub.

### Authors

- **Camilo Martinez** [[Equiman](http://github.com/equiman)]

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

⇧ [Back to menu](#menu)