## Why

The Positions list page has a "Ver proceso" button that does not navigate anywhere. Recruiters cannot view the candidates of a given position or move them through interview stages from the UI. The backend already exposes `/positions/:id/interviewFlow`, `/positions/:id/candidates`, and `PUT /candidates/:id/stage`, so the missing piece is the frontend page and the wiring of the button.

## What Changes

- Add a route `/positions/:id` rendering a new `PositionPage` (lazy-loaded).
- Wire the "Ver proceso" button in `Positions.tsx` to navigate to that route.
- Render a kanban board with one column per interview step (driven by `GET /positions/:id/interviewFlow`).
- Render each candidate (from `GET /positions/:id/candidates`) as a draggable card showing full name and average score visualized as 1–5 filled green dots.
- Drag-and-drop a candidate card across columns calls `PUT /candidates/:id/stage` with optimistic UI and rollback on error.
- Header shows `<Position Name> Position` with an inline back-arrow chevron returning to the positions list.
- Mobile (<768px): columns stack vertically full-width.

## Capabilities

### New Capabilities
- `position-kanban`: Detail view of a position with a kanban board of its candidates, drag-and-drop stage updates, and an optimistic UI backed by the existing REST endpoints.

### Modified Capabilities
<!-- No existing spec-level requirement changes. -->

## Impact

- **Frontend**: new route, page, hook, service, types, kanban components, styles. CRA→Vite already migrated.
- **Backend**: no API changes required; the three endpoints already exist (verified in `backend/src/application/services/positionService.ts` and `backend/src/presentation/controllers/candidateController.ts`).
- **Seed data**: `backend/seed-test-data.ts` now creates `Interview` records with scores so `averageScore` is non-zero on the kanban.
- **Testing**: new Cypress E2E (`cypress/e2e/position-kanban.cy.ts`) and Cypress support files (`cypress/support/e2e.ts`, `cypress/support/commands.ts`).
- **Dependencies**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` added.
