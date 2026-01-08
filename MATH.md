# Math

Numeric utilities for common calculations.

## API

**`clamp(value, min, max)`**

Clamps a number between a minimum and maximum value.

```typescript
import { clamp } from "@gumbee/utils"

clamp(15, 0, 10) // 10
clamp(-5, 0, 10) // 0
clamp(5, 0, 10) // 5
```
