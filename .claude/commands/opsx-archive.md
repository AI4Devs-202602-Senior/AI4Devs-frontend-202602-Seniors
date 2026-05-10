---
name: opsx:archive
description: Archive a completed change; keep version history.
argument-hint: "<change-id>"
---

# /opsx:archive

Moves a synced spec to the archive for historical reference.

## Usage

```
/opsx:archive add-position-kanban
```

## What it does

Dispatches `openspec-analyst` agent + `openspec-archive` skill:
1. Reads spec from `openspec/specs/{change-id}/`
2. Moves to `openspec/archive/{change-id}/` (or copies + updates status)
3. Adds timestamp and PR reference to archive entry
4. Commits to git

Result: Spec is archived but remains queryable via `npx opsx view`.
