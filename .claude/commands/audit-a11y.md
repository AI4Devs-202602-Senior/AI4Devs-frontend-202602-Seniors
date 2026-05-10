---
name: audit:a11y
description: Run axe-core, eslint-plugin-jsx-a11y, Lighthouse a11y; fix to ≥95.
argument-hint: ""
---

# /audit:a11y

Ensures WCAG 2.2 AA compliance across the frontend.

## Usage

```
/audit:a11y
```

## What it does

Dispatches `frontend-developer` + `graphic-designer` agents + `a11y-audit` skill:
1. Runs ESLint with `jsx-a11y` plugin; fixes violations
2. Runs Lighthouse a11y audit on both routes
3. Performs manual checks: contrast, focus rings, keyboard nav, skip links, `prefers-reduced-motion`
4. Runs axe-core browser scanner; fixes violations
5. Documents Lighthouse a11y score (target ≥ 95)

Result: WCAG 2.2 AA compliance; full keyboard + screen-reader support.
