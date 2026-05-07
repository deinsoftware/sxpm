# Changelog

<!-- http://keepachangelog.com/en/1.0.0/
Added       for new features.
Changed     for changes in existing functionality.
Deprecated  for once-stable features removed in upcoming releases.
Removed     for deprecated features removed in this release.
Fixed       for any bug fixes.
Security    to invite users to upgrade in case of vulnerabilities.
-->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `translate()` function that combines translateCommand + translateArgs

### Fixed

- npm `--latest` config: now moves package version to end correctly

## [0.0.1] - 2026-05-02

### Added

- Initial release of SXPM (Switch Cross Package Manager)
- Pure translation logic for package manager commands (translate, translateCommand, translateArgs)
- Package manager configurations for npm, yarn, yarn@berry, pnpm, bun, deno
- CHEATSHEET.md tracking implementation status

[Unreleased]: https://github.com/deinsoftware/sxpm/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/deinsoftware/sxpm/releases/tag/v0.0.1