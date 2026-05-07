# sxpm (Switch Cross Package Manager)

Core translation engine - Translate package manager commands between npm, yarn, pnpm, bun, and deno.

## Installation

```bash
npm install sxpm
```

## Usage

### Translate a command to one or more package managers

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

### Translate to all available package managers

```typescript
const result = translateCommand({
  command: 'add',
  args: ['react'],
  packageManagers: []  // empty array returns all
})
```

### Translate with specific version

```typescript
const result = translateCommand({
  command: 'upgrade',
  args: ['react'],
  packageManagers: ['yarn@berry']  // use yarn@berry config
})
```

### Translate arguments between package managers

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

### Handle errors

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

## API

### `translateCommand(params): TranslateCommandResult[]`

Translates a command from sxpm to one or more package managers.

**Params:**
- `command` (string): The sxpm command to translate
- `args` (string[]): Arguments for the command
- `packageManagers` (PackageManagerList[]): Target package managers (empty = all)
- `setPackageVersion` (string, optional): Specific version to use

**Returns:** Array of results with:
- `packageManager`: The target package manager
- `command`: Translated command
- `args`: Translated arguments
- `error` (optional): Error message if something went wrong

### `translateArgs(params): TranslateArgsResult[]`

Translates arguments between package managers.

**Params:**
- `args` (string[]): Arguments to translate
- `packageManagers` (PackageManagerList[]): Target package managers
- `command` (string, optional): Parent command context
- `setPackageVersion` (string, optional): Specific version to use

### `cleanFlag(args, flag, hasValue): void`

Removes a flag from args array.

### `getPackageConfig(cmd, version?): PackageConfiguration | undefined`

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