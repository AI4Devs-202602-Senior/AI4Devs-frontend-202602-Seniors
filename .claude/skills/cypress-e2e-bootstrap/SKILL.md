---
name: cypress-e2e-bootstrap
description: Install Cypress; configure for port 3000; add base spec for kanban happy path.
allowed-tools: [Read, Write, Edit, Bash]
---

# cypress-e2e-bootstrap Skill

## Checklist

Frontend directory: `frontend/`

- [ ] Install: `npm install --save-dev cypress`
- [ ] Generate default config: `npx cypress open` (creates `cypress.config.ts`, `cypress/e2e/`, `cypress/support/`)
- [ ] Update `cypress.config.ts`:
  ```ts
  import { defineConfig } from 'cypress'
  export default defineConfig({
    e2e: {
      baseUrl: 'http://localhost:3000',
      viewportWidth: 1280,
      viewportHeight: 720
    }
  })
  ```
- [ ] Create `cypress/e2e/position-kanban.cy.ts`:
  - [ ] Test: Navigate `/positions` → see list of positions
  - [ ] Test: Click "Ver proceso" → navigate to `/positions/:id`
  - [ ] Test: Kanban renders with columns from interview flow
  - [ ] Test: Drag candidate from column A to column B → optimistic move visible
  - [ ] Test: API PUT request fires with correct payload
  - [ ] Test: Reload page → candidate stays in new column
  - [ ] Test: Mobile viewport (320px) → columns stack vertically
- [ ] Create fixtures: `cypress/fixtures/interviewFlow.json`, `cypress/fixtures/candidates.json` with mock data
- [ ] Test locally: `npm run dev` (both frontend and backend), then `npx cypress open` → Electron browser, run spec
- [ ] Add npm script to `package.json`: `"cypress": "cypress open"` and `"cypress:run": "cypress run"`

## Success Criteria

- `npx cypress run` executes the spec and passes (if feature is complete)
- Spec covers happy path + drag-and-drop + mobile
- Fixtures are realistic and match API contract
