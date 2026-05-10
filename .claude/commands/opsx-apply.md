---
name: opsx:apply
description: Apply an approved proposal — flesh out design and coordinate implementation.
argument-hint: "<change-id>"
---

# /opsx:apply

Completes the design phase and coordinates agents to implement the proposal.

## Usage

```
/opsx:apply add-position-kanban
```

## What it does

Dispatches `openspec-analyst` agent + `openspec-apply` skill:
1. Reads proposal from `openspec/changes/{change-id}/`
2. Completes `design.md` with API endpoints, schema changes, dependencies, steps
3. Defines Zod input schemas
4. Lists Jest unit + Cypress E2E test scenarios
5. Commits to git with updated `openspec/config.yaml` (if stack changed)

Result: A fully specified design ready for parallel implementation by frontend-developer, sql-developer, graphic-designer, tester.
