# Logging

Styled console logging with colored owner labels and environment-aware filtering.

## API

The logging API is stable and designed to be used in both frontend and backend environments.

**`log(owner, ...messages)`**

Logs a message with a styled owner label. In production, this only logs if the owner path matches a whitelist pattern.

```typescript
import { log } from "@gumbee/utils"

log("api.auth", "User logged in")
log("api.auth.login", "Login attempt") // Nested path
log(["api", "auth", "login"], "Login attempt") // Array syntax (equivalent to "api.auth.login")
```

**`logError(owner, ...messages)`**

Logs an error with a styled owner label. Always logs regardless of environment.

**`logWarn(owner, ...messages)`**

Logs a warning with a styled owner label. Always logs regardless of environment.

## Configuration

In production environments, `log()` messages are suppressed by default to keep the console clean. You can enable specific logs by setting a whitelist environment variable.

Owner paths use dot-separated segments (e.g., `api.auth.login`). You can also pass an array of segments (e.g., `["api", "auth", "login"]`) which will be joined with dots. The whitelist pattern must match as a prefix of the owner path.

| Variable                    | Framework |
| :-------------------------- | :-------- |
| `LOG_WHITELIST`             | Any       |
| `NEXT_PUBLIC_LOG_WHITELIST` | Next.js   |
| `VITE_LOG_WHITELIST`        | Vite      |

**Whitelist Syntax:**

The whitelist uses dot-separated path prefixes with optional wildcards:

| Pattern              | Description                                                   |
| :------------------- | :------------------------------------------------------------ |
| `api.auth`           | Matches `api.auth` and any nested paths like `api.auth.login` |
| `api.auth,api.usage` | Multiple patterns separated by comma                          |
| `*`                  | Wildcard matching any single segment                          |
| `*.auth`             | Matches `api.auth`, `services.auth`, etc.                     |
| `api.*`              | Matches `api.auth`, `api.usage`, etc.                         |
| `api.*.error`        | Matches `api.auth.error`, `api.usage.error`, etc.             |

**Example Usage:**

```bash
# .env

# Enable logs from api.auth and all nested paths
LOG_WHITELIST=api.auth

# Enable logs from multiple paths
LOG_WHITELIST=api.auth,api.usage

# Enable all auth-related logs across any namespace
LOG_WHITELIST=*.auth

# Enable all error logs under api
LOG_WHITELIST=api.*.error
```
