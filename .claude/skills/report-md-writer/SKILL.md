---
name: report-md-writer
description: Capture openspec view output and run summary into docs/report.md (§18).
allowed-tools: [Read, Write, Edit, Bash]
---

# report-md-writer Skill

## Checklist

At repo root:

- [ ] Run `npx opsx view` and capture full output (copy to clipboard or save to temp file)
- [ ] Create `docs/report.md` using template from §18:
  ```markdown
  # OpenSpec Run Report
  
  ## openspec view
  [PASTE FULL OUTPUT HERE]
  
  ## Specs
  | Spec | Status | Last change |
  |---|---|---|
  | position-kanban | archived | YYYY-MM-DD |
  
  ## Changes
  | Change | Phase | Outcome |
  |---|---|---|
  | add-position-kanban | proposed → applied → synced → archived | shipped |
  
  ## Agentic Toolkit
  | Component | Path | Notes |
  |---|---|---|
  | Agents (×8) | .claude/agents/*.md | Canonical |
  | Skills | .claude/skills/**/SKILL.md | Atomic |
  | Commands | .claude/commands/*.md | Slash entry points |
  | Symlinks | .cursor, .windsurf, .antigravity, .github/copilot | Relative |
  
  ## Cross-references
  - See `PR.md` for the human-readable summary.
  ```
- [ ] Fill in OpenSpec view output (unmodified)
- [ ] List any specs and changes with their statuses
- [ ] Document the toolkit paths
- [ ] Commit: `git add docs/report.md && git commit -m "docs: OpenSpec run report"`

## Success Criteria

- `docs/report.md` exists
- OpenSpec view output is pasted verbatim
- All specs/changes are listed with status
- Toolkit section is complete
