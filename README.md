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

- [Playground](#playground)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Usage](#usage)
  - [crossTranslate](#crosstranslate)
  - [translateCommand](#translatecommand)
  - [translateArgs](#translateargs)
- [API](#api)
  - [crossTranslate](#crosstranslate)
  - [translateCommand](#translatecommand-1)
  - [translateArgs](#translateargs-1)
- [Supported Package Managers](#supported-package-managers)
- [About](#about)

---

## Playground

Try **sxpm** online at [deinsoftware.github.io/sxpm](https://deinsoftware.github.io/sxpm/)

Select package managers, type a command, and see real-time translations across npm, yarn, yarn@berry, pnpm, bun, and deno. The CLI output panel shows tabs per package manager — you can embed a similar interactive translation widget in your own documentation or website.

---

## Getting Started

`sxpm` is a library that translates package manager commands between different Node.js package managers. It provides a unified API to convert commands and arguments between npm, yarn (classic and berry), pnpm, bun, and deno.

> **Note**:  
> This is a core translation engine. For CLI commands, check [swpm](https://github.com/deinsoftware/swpm).

### Installation

Install with any package manager:

| Package Manager | Install Command      |
| --------------- | -------------------- |
| **npm**         | `npm install sxpm`   |
| **yarn**        | `yarn add sxpm`      |
| **pnpm**        | `pnpm add sxpm`      |
| **bun**         | `bun add sxpm`       |

⇧ [Back to menu](#menu)

---

## Usage

### crossTranslate

Translates a command with its arguments to one or more package managers.

```typescript
import { crossTranslate } from 'sxpm'

const result = crossTranslate({
  command: 'add',
  args: ['react', '--save-dev'],
  packageManagers: ['npm', 'yarn', 'pnpm']
})

console.log(result)
// {
//   npm: { command: 'install', args: ['react', '--save-dev'], cli: 'npm install react --save-dev' },
//   yarn: { command: 'add', args: ['react', '--dev'], cli: 'yarn add react --dev' },
//   pnpm: { command: 'add', args: ['react', '--save-dev'], cli: 'pnpm add react --save-dev' }
// }
```

### translateCommand

Translates only the command (not args) to one or more package managers.

```typescript
import { translateCommand } from 'sxpm'

const result = translateCommand({
  command: 'add',
  args: ['react', '--save-dev'],
  packageManagers: ['npm', 'pnpm']
})

// npm: { command: 'install', args: ['react', '--save-dev'], cli: 'npm install react --save-dev' }
// pnpm: { command: 'add', args: ['react', '--save-dev'], cli: 'pnpm add react --save-dev' }
```

### translateArgs

Translates only the arguments (not command) to one or more package managers.

```typescript
import { translateArgs } from 'sxpm'

const result = translateArgs({
  args: ['--save-dev'],
  packageManagers: ['npm', 'yarn', 'pnpm']
})

// npm: { args: ['--save-dev'] }
// yarn: { args: ['--dev'] }
// pnpm: { args: ['--save-dev'] }
```

#### `from` parameter

All translation functions accept an optional `from` parameter indicating the source package manager format (defaults to `swpm`):

```typescript
const result = crossTranslate({
  command: 'add',
  args: ['react'],
  packageManagers: ['yarn', 'pnpm'],
  from: 'swpm'  // explicit, this is the default
})
```

> Currently only `swpm` dictionaries are available as a source. Future versions will support translating directly between any package managers (e.g., `npm` → `yarn`, `pnpm` → `bun`, etc.).

#### Translate with Package Name

When you need to replace `<package>` placeholder with actual package name:

```typescript
const result = crossTranslate({
  command: 'upgrade',
  args: ['react', '--latest'],
  packageManagers: ['npm'],
  packageName: 'react'
})

// npm: { command: 'add', args: ['react', 'react@latest'], cli: 'npm add react react@latest' }
```

#### Error Handling

Commands that are **known but explicitly unavailable** on certain package managers return an error:

```typescript
const result = crossTranslate({
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

> **Unrecognized commands and arguments** (not found in any dictionary) are **replicated as-is** without error. For example, `swpm info sxpm --json` produces `npm info sxpm --json`, `yarn info sxpm --json`, etc.

⇧ [Back to menu](#menu)

---

## API

### `crossTranslate(params): CrossTranslateResult`

Translates a command and its arguments to one or more package managers.

**Params:**

| Param             | Type                            | Description                                                    |
| ----------------- | ------------------------------- | -------------------------------------------------------------- |
| `command`         | `string`                        | The swpm command to translate                                  |
| `args`            | `string[]`                      | Arguments for the command                                      |
| `packageManagers` | `PackageManagerList[]`          | Target package managers (empty = all)                          |
| `packageName`     | `string` (optional)             | Package name to replace `<package>` placeholder                |
| `from`            | `PackageManagerList` (optional) | Source package manager format (default: `swpm`)                |

**Returns:** `CrossTranslateResult`

```typescript
interface CrossTranslateResult {
  [packageManager: string]: {
    command: string
    args: string[]
    cli: string
    error?: string
  }
}
```

### `translateCommand(params): TranslateCommandResult`

Translates a command to one or more package managers. Same params as crossTranslate without the cross-translation logic.

### `translateArgs(params): TranslateArgsResult`

Translates arguments to one or more package managers.

**Params:**

| Param             | Type                            | Description                                                    |
| ----------------- | ------------------------------- | -------------------------------------------------------------- |
| `args`            | `string[]`                      | Arguments to translate                                         |
| `packageManagers` | `PackageManagerList[]`          | Target package managers (empty = all)                          |
| `command`         | `string` (optional)             | Command context for flag-specific translations                 |
| `packageName`     | `string` (optional)             | Package name to replace `<package>` placeholder                |
| `from`            | `PackageManagerList` (optional) | Source package manager format (default: `swpm`)                |

---

### Other exports

| Function            | Description                                    |
| ------------------- | ---------------------------------------------- |
| `packageExists`     | Check if a package manager is supported        |
| `getPackageConfig`  | Get configuration for a specific PM            |
| `availablePackages` | List all supported package managers            |
| `cleanFlag`         | Remove a flag from an args array               |

⇧ [Back to menu](#menu)

---

## Supported Package Managers

| Manager        | Version     | Lock File           |
| -------------- | ----------- | ------------------- |
| **npm**        | 7+          | `package-lock.json` |
| **yarn**       | Classic     | `yarn.lock`         |
| **yarn@berry** | 2+ (Berry)  | `yarn.lock`         |
| **pnpm**       | 7+          | `pnpm-lock.yaml`    |
| **bun**        | 1+          | `bun.lock`          |
| **deno**       | 2.0+        | `deno.lock`         |

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
