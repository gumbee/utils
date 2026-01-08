/** Color palette for styled console labels. Each owner gets a deterministic color based on their name. */
const colors = [
  { primary: "#003f5c", text: "white" },
  { primary: "#2f4b7c", text: "white" },
  { primary: "#665191", text: "white" },
  { primary: "#a05195", text: "white" },
  { primary: "#d45087", text: "white" },
  { primary: "#f95d6a", text: "white" },
  { primary: "#ff7c43", text: "black" },
  { primary: "#ffa600", text: "black" },
  { primary: "#ffc600", text: "black" },
]

const hash = (str: string): number => {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  return Math.abs(hash)
}

/**
 * Returns a deterministic color for a given string. The same string will always produce the same color.
 */
const getColor = (str: string): { primary: string; text: string } => {
  const colorIndex = hash(str) % colors.length
  return colors[colorIndex]!
}

/**
 * Retrieves the log whitelist from environment variables.
 * Supports Next.js (`NEXT_PUBLIC_LOG_WHITELIST`), Vite (`VITE_LOG_WHITELIST`), and generic (`LOG_WHITELIST`).
 *
 * Whitelist patterns support:
 * - Dot-separated path prefixes (e.g., `api.auth` matches `api.auth` and `api.auth.login`)
 * - Multiple patterns via comma separation (e.g., `api.auth,api.usage`)
 * - Wildcards with `*` to match any single segment (e.g., `*.auth`, `api.*.error`)
 */
const getLogWhitelist = (): string[] => {
  const whitelist = process.env.NEXT_PUBLIC_LOG_WHITELIST || process.env.VITE_LOG_WHITELIST || process.env.LOG_WHITELIST

  return whitelist?.split(",").map((s) => s.trim().toLowerCase()) || []
}

/** Checks if the current environment is production. */
const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production"
}

/**
 * Checks if an owner path matches a whitelist pattern.
 * Patterns support:
 * - Prefix matching: `api.auth` matches `api.auth` and `api.auth.login`
 * - Wildcards: `*` matches any single segment
 *   - `*.auth` matches `api.auth`, `services.auth`
 *   - `api.*` matches `api.auth`, `api.usage`
 *   - `api.*.error` matches `api.auth.error`, `api.usage.error`
 *
 * @param owner - The owner path to check (e.g., `api.auth.login`)
 * @param pattern - The whitelist pattern to match against
 * @returns True if the owner matches the pattern
 */
const matchesPattern = (owner: string, pattern: string): boolean => {
  const ownerSegments = owner.toLowerCase().split(".")
  const patternSegments = pattern.split(".")

  // Pattern must be a prefix of owner (or exact match)
  if (patternSegments.length > ownerSegments.length) {
    return false
  }

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i]!
    const ownerSegment = ownerSegments[i]!

    // Wildcard matches any single segment
    if (patternSegment === "*") {
      continue
    }

    if (patternSegment !== ownerSegment) {
      return false
    }
  }

  return true
}

/**
 * Determines if logging should occur based on the environment and whitelist.
 * In non-production, always returns true. In production, only returns true if the owner path matches a whitelist pattern.
 *
 * The owners list is joined into a single dot-separated path (e.g., `["api", "auth"]` becomes `api.auth`).
 *
 * Whitelist patterns support:
 * - Dot-separated path prefixes (e.g., `api.auth` matches `api.auth` and `api.auth.login`)
 * - Multiple patterns via comma separation (e.g., `api.auth,api.usage`)
 * - Wildcards with `*` to match any single segment (e.g., `*.auth`, `api.*.database`)
 *
 * @param owners - The list of owner segments that form the owner path.
 * @returns True if logging is allowed, false otherwise.
 */
const shouldLog = (owners: string[]): boolean => {
  if (!isProduction()) {
    return true
  }

  const whitelist = getLogWhitelist()

  if (whitelist.length === 0) {
    return false
  }

  const ownerPath = owners.join(".")
  return whitelist.some((pattern) => matchesPattern(ownerPath, pattern))
}

/**
 * Builds styled console label arguments for the given owners.
 * Returns a tuple of [labelString, ...styles] to spread into console methods.
 */
const buildOwnerLabels = (owners: string[]): [string, ...string[]] => {
  const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined"

  if (isBrowser) {
    const labels: string[] = []
    const styles: string[] = []

    for (const ownerName of owners) {
      const color = getColor(ownerName)
      labels.push(`%c ${ownerName.toUpperCase()} `)
      styles.push(
        `background: ${color.primary}; color: ${color.text}; padding: 2px 0px; border-radius: 4px; font-weight: semibold; font-size: 0.8em; margin-right: 4px;`,
      )
    }

    return [labels.join(""), ...styles]
  }

  // Node/Terminal environment
  const labels: string[] = []
  for (const ownerName of owners) {
    labels.push(`\x1b[36m[${ownerName.toUpperCase()}]\x1b[0m`)
  }

  return [labels.join(" ")]
}

/**
 * Log a message to the console. Will display a colored label with the owner(s) name.
 * Automatically skips logging in production unless the owner path matches a whitelist pattern.
 *
 * Owner can be specified as a dot-separated string (e.g., `api.auth.login`) or as an array
 * of segments (e.g., `["api", "auth", "login"]`) which will be joined with dots.
 *
 * See {@link shouldLog} for whitelist pattern details.
 *
 * @param owner - The owner path (e.g., `api.auth` or `["api", "auth"]`).
 * @param messages - The messages to log
 */
export function log(owner: string | string[], ...messages: unknown[]): void {
  const owners = Array.isArray(owner) ? owner : [owner]

  if (!shouldLog(owners)) {
    return
  }

  const [label, ...styles] = buildOwnerLabels(owners)
  console.log(label, ...styles, ...messages)
}

/**
 * Log an error message to the console. Will display a colored label with the owner(s) name.
 * Always logs regardless of environment (not subject to whitelisting).
 *
 * Owner can be specified as a dot-separated string (e.g., `api.auth.login`) or as an array
 * of segments (e.g., `["api", "auth", "login"]`) which will be joined with dots.
 *
 * @param owner - The owner path (e.g., `api.auth` or `["api", "auth"]`).
 * @param messages - The messages to log
 */
export function logError(owner: string | string[], ...messages: unknown[]): void {
  const owners = Array.isArray(owner) ? owner : [owner]
  const [label, ...styles] = buildOwnerLabels(owners)
  console.error(label, ...styles, ...messages)
}

/**
 * Log a warning message to the console. Will display a colored label with the owner(s) name.
 * Always logs regardless of environment (not subject to whitelisting).
 *
 * Owner can be specified as a dot-separated string (e.g., `api.auth.login`) or as an array
 * of segments (e.g., `["api", "auth", "login"]`) which will be joined with dots.
 *
 * @param owner - The owner path (e.g., `api.auth` or `["api", "auth"]`).
 * @param messages - The messages to log
 */
export function logWarn(owner: string | string[], ...messages: unknown[]): void {
  const owners = Array.isArray(owner) ? owner : [owner]
  const [label, ...styles] = buildOwnerLabels(owners)
  console.warn(label, ...styles, ...messages)
}
