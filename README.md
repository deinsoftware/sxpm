# sxpm (Switch Cross Package Manager)

Core translation engine - Translate package manager commands between npm, yarn, pnpm, bun, and deno.

## Installation

```bash
npm install sxpm
```

## Usage

### Translate a command to a specific package manager

```typescript
import { translate } from 'sxpm'

const result = translate({
  command: 'add',
  args: ['react', '--save-dev'],
  from: 'npm',
  to: 'pnpm'
})

console.log(result)
// { command: 'add', args: ['react', '-D'], pm: 'pnpm' }
```

### Translate to all package managers

```typescript
import { translateToAll } from 'sxpm'

const results = translateToAll({
  command: 'add',
  args: ['react'],
  from: 'npm'
})

console.log(results)
// [
//   { command: 'add', args: ['react'], pm: 'pnpm' },
//   { command: 'add', args: ['react'], pm: 'yarn' },
//   ...
// ]
```

### Detect current package manager

```typescript
import { detectPackageManager } from 'sxpm'

const result = await detectPackageManager()
console.log(result)
// { origin: 'lock', cmd: 'pnpm' } | undefined
```

## API

### `translate(params: TranslateParams): TranslateResult`

Translates a command from one package manager to another.

### `translateToAll(params: Omit<TranslateParams, 'to'>): TranslateResult[]`

Translates a command from one package manager to all supported package managers.

### `detectPackageManager(): Promise<DetectResult | undefined>`

Detects the current package manager based on:

1. `swpm` property in package.json (pinned)
2. `packageManager` property in package.json
3. Lock files
4. Deno config files
5. `SWPM` environment variable

## Supported Package Managers

- npm
- yarn (classic)
- yarn@berry (v2+)
- pnpm
- bun
- deno (v2.0+)

## License

MIT
