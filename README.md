# sxpm (Switch Cross Package Manager)

Core translation engine - Translate package manager commands between npm, yarn, pnpm, bun, and deno.

## Installation

```bash
npm install sxpm
```

## Usage

### Translate a command to a specific package manager

```typescript
import { translateCommand } from 'sxpm'

const result = translateCommand({
  command: 'add',
  args: ['react', '--save-dev'],
  from: 'npm',
  to: 'pnpm'
})

console.log(result)
// { command: 'add', args: ['react', '-D'], pm: 'pnpm' }
```

### Translate arguments between package managers

```typescript
import { translateArgs } from 'sxpm'

const result = translateArgs({
  args: ['--save-dev', 'react'],
  from: 'npm',
  to: 'pnpm'
})

console.log(result)
// ['-D', 'react']
```

## API

### `translateCommand(params): TranslateCommandResult`

Translates a command from one package manager to another.

### `translateArgs(params): TranslateArgsResult`

Translates arguments from one package manager to another.

### `cleanFlag(flag, from, to): string | [string, number]`

Cleans a flag for translation between package managers.

### `getPackageConfig(cmd): PackageConfiguration | undefined`

Gets the configuration for a specific package manager.

### `packageExists(cmd): boolean`

Checks if a package manager is supported.

### `availablePackages(): PackageManagerList[]`

Returns list of all supported package managers.

## Supported Package Managers

- npm
- yarn (classic)
- yarn@berry (v2+)
- pnpm
- bun
- deno (v2.0+)

## License

MIT
