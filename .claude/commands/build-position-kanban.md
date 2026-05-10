---
name: build:position-kanban
description: End-to-end Position kanban feature build (orchestrates all parallel agents).
argument-hint: ""
---

# /build:position-kanban

Drives the full Position kanban feature from design to shipped, coordinating all agents in parallel and series as needed.

## Usage

```
/build:position-kanban
```

## What it does

**Phase 1 (parallel):** `graphic-designer`, `frontend-developer`, `sql-developer`
- **graphic-designer**: Pixel-perfect Kanban UI from `docs/position.avif`; responsive mobile; focus rings + contrast
- **frontend-developer**: `PositionPage.tsx`, `Kanban/*` components, `usePositionBoard` hook, `positionService.ts`, types, routing, lazy loading, Web Vitals
- **sql-developer**: Update backend routes to match spec (plural `/positions`, `/stage` suffix), add Zod schemas, standard error shapes

**Phase 2 (serial after Phase 1):** `tester`, `owasp-security`, `sast-pentester`
- **tester**: Jest tests for backend ≥ 80%, Cypress E2E (drag-drop, mobile, optimistic moves)
- **owasp-security**: Review for XSS, injection, secrets; verify DOMPurify + Zod
- **sast-pentester**: semgrep + npm audit; fix high/critical findings

Result: Full-stack Position kanban feature shipped with tests, security review, a11y audit all passing.
