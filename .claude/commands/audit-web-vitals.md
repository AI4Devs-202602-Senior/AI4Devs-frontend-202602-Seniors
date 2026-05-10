---
name: audit:web-vitals
description: Measure Core Web Vitals (LCP, INP, CLS); suggest optimizations.
argument-hint: ""
---

# /audit:web-vitals

Measures and improves Core Web Vitals scores on the current frontend.

## Usage

```
/audit:web-vitals
```

## What it does

Dispatches `frontend-developer` agent + `web-vitals-audit` skill:
1. Runs Lighthouse on `/positions` and `/positions/:id` routes
2. Measures LCP (target < 2.5s), INP (target < 200ms), CLS (target < 0.1)
3. Identifies bottlenecks (heavy images, long JS tasks, layout shifts)
4. Implements fixes: image preload/lazy, code splitting, reserved space
5. Re-runs Lighthouse; documents scores

Result: Core Web Vitals within budgets; code optimized for performance.
