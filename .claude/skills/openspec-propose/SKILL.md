---
name: openspec-propose
description: Create a proposal under openspec/changes/ with problem, scope, benefits, test plan.
allowed-tools: [Read, Write, Edit, Bash]
---

# openspec-propose Skill

## Checklist

- [ ] Generate unique change ID (e.g., `add-position-kanban`)
- [ ] Create `openspec/changes/{change-id}/problem.md` — describe the gap, user need
- [ ] Create `openspec/changes/{change-id}/scope.md` — define what is included and excluded
- [ ] Create `openspec/changes/{change-id}/benefits.md` — why this change matters, outcomes
- [ ] Create `openspec/changes/{change-id}/test-plan.md` — Jest backend unit tests, Cypress E2E flows, a11y checks, OWASP review
- [ ] Create `openspec/changes/{change-id}/design.md` (skeleton) — API endpoints, schema changes, dependencies (to be filled during apply phase)
- [ ] Run `npx opsx view` to verify the change is recognized
- [ ] Commit: `git add openspec/changes/{change-id}/ && git commit -m "spec: propose {change-id}"`

## Success Criteria

- `openspec/changes/{change-id}/` exists with all 4 markdown files
- Each file has clear, declarative language (no TODOs)
- `npx opsx view` lists the proposal as "proposed"
