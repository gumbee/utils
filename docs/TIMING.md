# Timing

Timing helpers for debouncing, throttling, and sleeping in async flows.

## API

**`debounce(fn, delay)`**

Creates a debounced function that delays invocation until `delay` milliseconds have passed since the last call.

- Uses the latest arguments provided during the debounce window
- Returns a callable function with `.cancel()` and `.flush()` methods

```typescript
import { debounce } from "@gumbee/utils"

const saveDraft = debounce((value: string) => {
  console.log("saving", value)
}, 300)

saveDraft("h")
saveDraft("he")
saveDraft("hel")
saveDraft("hell")
saveDraft("hello")
// After 300ms, logs: "saving hello"

saveDraft.cancel() // Cancels any pending invocation
saveDraft.flush() // Immediately invokes pending call (if any)
```

**`throttle(fn, delay)`**

Creates a throttled function that runs at most once per `delay` milliseconds.

- First call executes immediately
- Calls during the throttle window are coalesced
- The latest queued call runs when the window ends
- Returns a callable function with `.cancel()` and `.flush()` methods

```typescript
import { throttle } from "@gumbee/utils"

const trackScroll = throttle((y: number) => {
  console.log("scrollY", y)
}, 100)

window.addEventListener("scroll", () => {
  trackScroll(window.scrollY)
})

trackScroll.cancel() // Clears pending trailing execution and resets state
trackScroll.flush() // Executes latest pending call immediately (if any)
```

**`sleep(ms)`**

Returns a promise that resolves after `ms` milliseconds.

```typescript
import { sleep } from "@gumbee/utils"

await sleep(500)
console.log("Half a second later")
```
