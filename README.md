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
This package is part of the [Gumbee monorepo](https://github.com/Gumbee/gumbee).

To report bugs or submit patches please use [GitHub issues](https://github.com/Gumbee/gumbee/issues).
