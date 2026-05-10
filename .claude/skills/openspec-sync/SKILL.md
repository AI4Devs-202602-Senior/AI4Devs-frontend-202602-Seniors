---
name: openspec-sync
description: Update specs to match shipped behavior; align code with design.
allowed-tools: [Read, Write, Edit, Bash]
---

# openspec-sync Skill

## Checklist

- [ ] Verify shipped code matches `design.md` — if diffs, update design to reflect reality
- [ ] Move change from `openspec/changes/{change-id}/` to `openspec/specs/{change-id}/` when code is production-ready
- [ ] Create or update `openspec/specs/{change-id}/spec.md` with final behavior (Given/When/Then)
- [ ] Add version history line: `## v1.0 — YYYY-MM-DD (Synced from code review)`
- [ ] Link to merged PR in spec for traceability
- [ ] Run `npx opsx view` to verify change is listed under specs
- [ ] Commit: `git add openspec/ && git commit -m "spec: sync {change-id}"`

## Success Criteria

- Code behavior matches spec; no discrepancies
- Change is visible in `npx opsx view` under synced specs
- Version history is up-to-date
