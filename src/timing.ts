/**
 * A function that can be cancelled or flushed.
 */
export interface DebouncedFunction<T extends (...args: any[]) => void> {
  (...args: Parameters<T>): void
  cancel(): void
  flush(): void
}

/**
 * A function that can be cancelled or flushed.
 */
export interface ThrottledFunction<T extends (...args: any[]) => void> {
  (...args: Parameters<T>): void
  cancel(): void
  flush(): void
}

/**
 * Creates a debounced function that delays invoking `fn` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * The latest arguments provided to the debounced function are passed to `fn`.
 *
 * @param fn - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns A debounced function with .cancel() and .flush() methods
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let latestArgs: Parameters<T> | null = null

  const debounced = (...args: Parameters<T>) => {
    latestArgs = args

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (latestArgs) {
        fn(...latestArgs)
        latestArgs = null
      }
      timeoutId = null
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    latestArgs = null
  }

  debounced.flush = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
      if (latestArgs) {
        fn(...latestArgs)
        latestArgs = null
      }
    }
  }

  return debounced
}

/**
 * Creates a throttled function that only invokes `fn` at most once per every `delay` milliseconds.
 * The first call executes immediately. Subsequent calls are ignored until the delay passes,
 * but if calls were made during the delay, the latest one will execute at the end of the delay.
 *
 * @param fn - The function to throttle
 * @param delay - The number of milliseconds to throttle
 * @returns A throttled function with .cancel() and .flush() methods
 */
export function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): ThrottledFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastExecTime = 0
  let latestArgs: Parameters<T> | null = null

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now()
    latestArgs = args

    if (!lastExecTime && timeoutId === null) {
      // First execution
      fn(...args)
      lastExecTime = now
      latestArgs = null
    } else {
      // Subsequent executions
      if (timeoutId === null) {
        const remaining = delay - (now - lastExecTime)
        
        timeoutId = setTimeout(() => {
          if (latestArgs) {
            fn(...latestArgs)
            lastExecTime = Date.now()
            latestArgs = null
          }
          timeoutId = null
        }, Math.max(0, remaining))
      }
    }
  }

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastExecTime = 0
    latestArgs = null
  }

  throttled.flush = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (latestArgs) {
      fn(...latestArgs)
      lastExecTime = Date.now()
      latestArgs = null
    }
  }

  return throttled
}
