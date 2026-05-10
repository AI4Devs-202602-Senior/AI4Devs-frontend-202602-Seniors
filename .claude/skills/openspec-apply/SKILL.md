---
name: openspec-apply
description: Apply an approved proposal — flesh out design, dependencies, implementation steps.
allowed-tools: [Read, Write, Edit, Bash]
---

# openspec-apply Skill

## Checklist

- [ ] Read proposal from `openspec/changes/{change-id}/` to understand scope
- [ ] Complete `openspec/changes/{change-id}/design.md`:
  - [ ] API endpoint contracts (URLs, request/response shapes)
  - [ ] Database schema changes (Prisma migrations)
  - [ ] New dependencies (npm packages, versions)
  - [ ] Implementation steps (numbered, atomic, testable)
  - [ ] Test cases per test-plan.md (Given/When/Then)
  - [ ] Mock/fixture data needed
- [ ] Define Zod input schemas for all endpoints
- [ ] List Jest backend unit test scenarios (service + controller)
- [ ] List Cypress E2E test scenarios (happy path, error cases, mobile)
- [ ] Update `openspec/config.yaml` if stack changed (new deps, tooling)
- [ ] Run `npx opsx view` to confirm state is "applied"
- [ ] Commit: `git add openspec/ && git commit -m "spec: apply {change-id}"`

## Success Criteria

- `design.md` is complete with all sections
- API examples are testable (can hit from frontend/backend code)
- Test plan aligns with design (test cases have corresponding impl steps)
- `npx opsx view` lists change as "applied"
