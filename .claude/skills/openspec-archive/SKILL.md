---
name: openspec-archive
description: Archive completed change; keep version history.
allowed-tools: [Read, Write, Edit, Bash]
---

# openspec-archive Skill

## Checklist

- [ ] Verify change is fully synced to `openspec/specs/{change-id}/`
- [ ] Create `openspec/archive/` directory if it doesn't exist
- [ ] Move `openspec/specs/{change-id}/` to `openspec/archive/{change-id}/` (or copy + update status)
- [ ] Add archive entry: `openspec/archive/{change-id}/status.md` — "Archived on YYYY-MM-DD, shipped in PR #XYZ"
- [ ] Run `npx opsx view` to confirm archive is listed
- [ ] Commit: `git add openspec/ && git commit -m "spec: archive {change-id}"`

## Success Criteria

- Change is moved to archive
- Version history is preserved with dates
- `npx opsx view` reflects archived state
