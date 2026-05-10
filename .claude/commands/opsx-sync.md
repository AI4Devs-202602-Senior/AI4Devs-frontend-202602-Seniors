---
name: opsx:sync
description: Sync specs to match shipped code; move change from changes/ to specs/.
argument-hint: "<change-id>"
---

# /opsx:sync

Aligns the specification with implemented code and archives the proposal.

## Usage

```
/opsx:sync add-position-kanban
```

## What it does

Dispatches `openspec-analyst` agent + `openspec-sync` skill + in parallel: `frontend-developer`, `sql-developer`, `tester`:
1. Verifies shipped code matches the design
2. Updates `design.md` to reflect any real-world deviations
3. Moves change from `openspec/changes/{change-id}/` to `openspec/specs/{change-id}/`
4. Creates final `spec.md` with Given/When/Then behavior
5. Adds version history line with date and PR reference
6. Commits to git

Result: Spec is now a permanent record of the shipped feature.
