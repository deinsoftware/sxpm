---
name: sxpm-manager-commands-args
id: sxpm-manager-commands-args
version: 1.0.0
tags: [sxpm, package-manager, command-mapping, args-mapping, typescript]
description: Manage cmds and args props in SXPM package manager configs (src/managers/*.ts), including adding, modifying or removing command and argument mappings across npm, yarn, pnpm, bun, deno. Includes internal templates and real-world examples.
---

# Manage SXPM Commands and Args

Use this skill when creating or modifying `cmds` and/or `args` props in package manager configuration files under `src/managers/*.ts`. Handles adding new mappings, updating existing ones, and ensuring consistency across all supported package managers.

## When to Use

- User requests to add/modify/remove a command or argument mapping
- Changes to `cmds` or `args` props in `src/managers/*.ts` files
- Ensuring consistent command/argument support across npm, yarn, pnpm, bun, deno
- **Do not use** for changes outside manager config files, or for commands/args identical across all package managers

## Instructions

1. **Modify/Add cmds or args in package manager configs**
   - Edit target files in `src/managers/*.ts` (npm.ts, yarn.ts, pnpm.ts, bun.ts, deno.ts)
   - For `cmds` prop: follow templates in `templates/commands.md` (Replace, Replace+Flag, Not Available, Positional)
   - For `args` prop: follow templates in `templates/args.md` (Replace, Replace with Command, Convert to Commands, Remove, Package Decoration, Not Available)
   - Ensure consistency: update all relevant manager files for the same command/argument

2. **Handle command files (only for new/modified commands)**
   - New command: Create `src/cli/commands/<command-name>.ts` with @yargs v18 API
   - Modified command: Edit existing command file if behavior changes
   - Command file MUST exist for the command to work

3. **Update CLI registration (only for new commands)**
   - Edit `src/cli/cli.ts` to register new commands
   - Verify existing registration is valid for modified commands

4. **Update documentation**
   - Update `CHEATSHEET.md` with `[x]`/`[ ]` markers for command support
   - Update `README.md` if support status changed (remove/add availability warnings)

5. **Verify**
   - Run `npm run build` to compile TypeScript
   - Run `npm run test` to check regressions
   - Test changes with target package managers

## Constraints

- New commands require all three: manager config entry + command file + cli.ts registration
- Args-only changes only require manager config updates
- Only map `cmds`/`args` that differ across package managers
- Identical commands/args across all managers do NOT need mapping
- SXPM passes through unknown commands/args as-is to detected package manager
- ESM only, Node.js >= 20, TypeScript strict mode

## Examples

### Example 1: Replace command (remove → uninstall)

**User request**: "Map `remove` command to `uninstall` for npm"

**Context**: npm uses `uninstall` while other package managers use `remove`

**Action**:

1. Edit `src/managers/npm.ts` `cmds` prop following `templates/commands.md`:

```typescript
cmds: {
  remove: 'uninstall',
  r: 'uninstall',
  rm: 'uninstall',
  un: 'uninstall',
}
```

**Result**: `sxpm translate({ command: 'remove', from: 'npm', to: 'pnpm' })` → `{ command: 'uninstall', ... }`

---

### Example 2: Replace+Flag command (upgrade → install --latest)

**User request**: "Make `upgrade` command use `install --latest` in npm"

**Context**: npm uses `install --latest` to upgrade packages, while pnpm uses `update`

**Action**:

Edit `src/managers/npm.ts` `cmds` prop:

```typescript
cmds: {
  upgrade: ['install', '--latest'],
  ug: ['install', '--latest'],
}
```

**Result**: `sxpm translate({ command: 'upgrade', from: 'npm', to: 'pnpm' })` → `{ command: 'update', ... }`

---

### Example 3: Not Available command

**User request**: "Mark `why` command as not available for npm"

**Context**: npm doesn't have a `why` command, but pnpm and yarn do

**Action**:

Edit `src/managers/npm.ts` `cmds` prop:

```typescript
cmds: {
  why: ['', -1],
}
```

**Result**: `sxpm translate({ command: 'why', from: 'npm', to: 'pnpm' })` → throws error (not available)

---

### Example 4: Positional command (run with -- separator)

**User request**: "Add support for passing args after `--` in `run` command"

**Context**: Need to pass additional args to the script being run

**Action**:

Edit all manager config files:

```typescript
cmds: {
  run: { '--': '--' },
}
```

**Result**: `sxpm translate({ command: 'run', args: ['test', '--', '--watch'], from: 'npm', to: 'pnpm' })` → `{ command: 'run', args: ['test', '--', '--watch'] }`

---

### Example 5: Package Decoration arg (--latest → @latest)

**User request**: "Make `--latest` flag add `@latest` to package name"

**Context**: Install package with latest tag

**Action**:

Edit `src/managers/npm.ts` `args` prop following `templates/args.md`:

```typescript
args: {
  '--latest': ['<package>@latest', 1],
  '-L': ['<package>@latest', 1],
}
```

**Result**: `sxpm translate({ command: 'add', args: ['express', '--latest'], from: 'npm', to: 'pnpm' })` → `{ command: 'add', args: ['express@latest'] }`

---

### Example 6: Replace with Command arg (--global → global command)

**User request**: "Convert `--global` flag to `global` command for npm"

**Context**: npm uses `--global` flag, pnpm uses `global` subcommand

**Action**:

Edit `src/managers/npm.ts` `args` prop:

```typescript
args: {
  '--global': ['', -1],
  '-g': ['', -1],
}
```

**Result**: `sxpm translate({ command: 'add', args: ['express', '--global'], from: 'npm', to: 'pnpm' })` → `{ command: 'global', args: ['add', 'express'] }`

---

### Example 7: Convert to Commands arg (--frozen → ci)

**User request**: "Make `--frozen` flag convert `install` to `ci` command"

**Context**: pnpm uses `ci` for frozen installs

**Action**:

Edit `src/managers/pnpm.ts` `args` prop:

```typescript
args: {
  '--frozen': {
    i: 'ci',
    install: 'ci',
  },
}
```

**Result**: `sxpm translate({ command: 'install', args: ['--frozen'], from: 'pnpm', to: 'npm' })` → `{ command: 'ci', args: [] }`

---

## Observations

Before acting, observe:

- Review existing `cmds` and `args` patterns in manager files at `src/managers/*.ts`
- Verify `CHEATSHEET.md` for current implementation status
- Check `src/cli/commands/` for existing command files
- Reference `templates/commands.md` and `templates/args.md` for configuration patterns
