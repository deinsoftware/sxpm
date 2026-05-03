# AGENTS.md - SXPM

## Commands

- Build: `npm run build` (tsc → `bin/`)
- Test all: `npm run test` (vitest, **requires `--pool=forks` for ESM**)
- Single test: `npx vitest run <src/path/to/test.test.ts> --pool=forks`
- Type check: `npm run ts:check`
- Lint: `npm run lint`
- Coverage: `npm run test:c`

## Architecture

- **SXPM** = Pure translation core (this package): no CLI, file ops, or execution logic
- **SXPM** = CLI package that depends on SXPM for translation
- Public API: `src/index.ts` exports `translateCommand`, `translateArgs`, `cleanFlag`, `getPackageConfig`, `packageExists`, `availablePackages`
- Manager configs: `src/managers/*.ts` (npm, yarn, yarn@berry, pnpm, bun, deno)
- Translation logic: `src/translator/`

## Repo-Specific Quirks

- ESM only (`"type": "module"`), Node ≥20, TypeScript strict
- Exact dependency versions: `.npmrc` sets `save-exact=true` (no `^` in `package.json`)
- Vitest **must** use `--pool=forks` for ESM tests (fails otherwise)
- ESLint flat config (`eslint.config.mjs`, rules: no semicolons, single quotes, 2-space indent)

## Skills

`sxpm-*` skills in `.agents/skills/`:

- `sxpm-manage-commands-args`: Update cmds/args in manager configs
- `sxpm-code-review`: Automated code review (run `bash .agents/skills/sxpm-code-review/scripts/code-review.sh`)
- `sxpm-release`: Version bumping per SemVer/Keep a Changelog
- See each skill's `SKILL.md` for detailed workflows

## Key References

- `CHEATSHEET.md`: Tracks supported commands/args across package managers
- `CHANGELOG.md`: Follows Keep a Changelog 1.1.0, SemVer 2.0.0
- `README.md`: Public API usage examples
