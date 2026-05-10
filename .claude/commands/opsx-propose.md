---
name: opsx:propose
description: Create a proposal for a new feature or change.
argument-hint: "<title>"
---

# /opsx:propose

Creates a proposal under `openspec/changes/` with problem statement, scope, benefits, and test plan.

## Usage

```
/opsx:propose add-position-kanban
```

## What it does

Dispatches `openspec-analyst` agent + `openspec-propose` skill:
1. Opens `openspec/changes/{change-id}/` directory
2. Writes `problem.md`, `scope.md`, `benefits.md`, `test-plan.md`, `design.md` (skeleton)
3. Commits to git

Result: A proposal ready for review and application via `/opsx:apply`.
