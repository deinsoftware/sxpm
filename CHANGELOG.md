# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-05-16

### Added

- `crossTranslate` function that translates commands across multiple package managers
- `from` parameter in all translation functions to specify source dictionary format
- Interactive playground page in `docs/` with live translation, combobox examples, per-PM CLI tabs, and JSON response panel
- `packageExists`, `getPackageConfig`, `availablePackages`, `cleanFlag` exports

### Changed

- Renamed `translate` to `crossTranslate` for clarity
- Restructured manager configs from `src/managers/*.ts` to `src/managers/swpm/`
- API now supports array of package managers with version suffixes (e.g. `yarn@berry`)
- Updated README with Playground section, `from` param docs, and aligned tables
- Improved test coverage and updated tests to match actual behavior

### Removed

- Unused `find-up` dependencies from devDependencies

### Fixed

- npm `--latest` config: package version now moves to end correctly
- Unknown commands and args are replicated as-is instead of erroring

## [0.0.1] - 2026-05-02

### Added

- Initial release of SXPM (Switch Cross Package Manager)
- Pure translation logic for package manager commands (translateCommand, translateArgs)
- Package manager configurations for npm, yarn, yarn@berry, pnpm, bun, deno
- CHEATSHEET.md tracking implementation status

[unreleased]: https://github.com/deinsoftware/sxpm/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/deinsoftware/sxpm/compare/v0.0.1...v1.0.0
[0.0.1]: https://github.com/deinsoftware/sxpm/releases/tag/v0.0.1
