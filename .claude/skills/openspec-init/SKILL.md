---
name: openspec-init
description: Install OpenSpec per quickstart; scaffold openspec/ directory.
allowed-tools: [Read, Write, Edit, Bash]
---

# openspec-init Skill

## Checklist

- [ ] Run `npm install @fission-ai/openspec --save-dev`
- [ ] Create `openspec/` directory at repo root
- [ ] Create `openspec/config.yaml` with project context (per §10 template)
- [ ] Create `openspec/specs/` directory for current specs
- [ ] Create `openspec/changes/` directory for proposals
- [ ] Run `npx opsx view` to verify installation — should not error
- [ ] Commit initial scaffold: `git add openspec/ && git commit -m "chore: OpenSpec scaffold"`

## Success Criteria

- `openspec/` exists with subdirectories `specs/`, `changes/`
- `openspec/config.yaml` is present and valid YAML
- `npx opsx view` runs without warnings or errors
