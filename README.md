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
  - [translate](#translate)
- [API](#api)
  - [translate](#translateparams-translateresult)
- [Supported Package Managers](#supported-package-managers)
- [About](#about)

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

### translate

Translates a command with its arguments to one or more package managers.

```typescript
import { translate } from 'sxpm'

const result = translate({
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

#### Translate with Package Name

When you need to replace `<package>` placeholder with actual package name:

```typescript
const result = translate({
  command: 'upgrade',
  args: ['react', '--latest'],
  packageManagers: ['npm'],
  packageName: 'react'
})

// npm: { command: 'add', args: ['react', 'react@latest'], cli: 'npm add react react@latest' }
```

#### Error Handling

Commands that are not available on certain package managers return an error:

```typescript
const result = translate({
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

### `translate(params): TranslateResult`

Translates a command and its arguments to one or more package managers.

**Params:**

| Param             | Type                  | Description                                     |
| ----------------- | --------------------- | ----------------------------------------------- |
| `command`         | `string`              | The sxpm command to translate                   |
| `args`            | `string[]`            | Arguments for the command                       |
| `packageManagers` | `PackageManagerList[]`| Target package managers (empty = all)           |
| `packageName`     | `string` (optional)   | Package name to replace `<package>` placeholder |

**Returns:** `TranslateResult`

```typescript
interface TranslateResult {
  [packageManager: string]: {
    command: string
    args: string[]
    cli: string
    error?: string
  }
}
```

| Property   | Type                  | Description                    |
| ---------- | --------------------- | ------------------------------ |
| `command`  | `string`              | Translated command             |
| `args`     | `string[]`            | Translated arguments           |
| `cli`      | `string`              | Full CLI command string        |
| `error`    | `string` (optional)   | Error message if not available |

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
