# @gumbee/utils

<div align="left">

[![npm version](https://img.shields.io/npm/v/@gumbee/utils.svg)](https://www.npmjs.com/package/@gumbee/utils)
[![License](https://img.shields.io/npm/l/@gumbee/utils.svg)](package.json)

</div>

@gumbee/utils is a collection of shared utilities designed primarily for the [Gumbee](https://github.com/Gumbee/gumbee) ecosystem. It provides essential helpers for logging, math operations, and other common tasks used across Gumbee packages.

While this package is intended for internal use within the Gumbee codebase, it is published publicly and can be used in other projects if found useful.

The canonical source tree and bug trackers are available on [GitHub](https://github.com/Gumbee/gumbee).
For license information, see [LICENSE](LICENSE) (MIT).

## Installation

```bash
bun add @gumbee/utils
# npm install @gumbee/utils
# pnpm add @gumbee/utils
# yarn add @gumbee/utils
```

## Documentation

- [Logging](docs/LOGGING.md) - Styled console logging with colored owner labels and environment-aware filtering.
- [Math](docs/MATH.md) - Numeric utilities for common calculations.

## Configuration

The logging utility supports environment-aware filtering using the `LOG_WHITELIST` environment variable (or framework-specific equivalents like `NEXT_PUBLIC_LOG_WHITELIST` or `VITE_LOG_WHITELIST`). See [Logging](docs/LOGGING.md#configuration) for details.

## Development

For build information, check the `package.json` scripts.
This package is part of the Gumbee ecosystem of packages used by myself to build various personal projects and ideas.

To report bugs or submit patches please use [GitHub issues](https://github.com/gumbee/utils/issues).

## Releasing

This package uses [changesets](https://github.com/changesets/changesets) for version management and GitHub Actions for automated publishing.

### Creating a Changeset

When you make changes that should be released, create a changeset:

```bash
bun changeset
```

This will prompt you to:

1. Select the type of change (patch, minor, major)
2. Write a summary of the changes

Commit the generated changeset file (in `.changeset/`) with your changes.

### Publishing a Release

When ready to release:

```bash
# 1. Apply changesets to bump version and update CHANGELOG
bun run version

# 2. Commit the version bump
git add .
git commit -m "chore: release v1.x.x"

# 3. Create and push the tag
git tag v1.x.x
git push origin main --tags
```

The GitHub Actions workflow will automatically build, test, and publish to npm when the tag is pushed.
