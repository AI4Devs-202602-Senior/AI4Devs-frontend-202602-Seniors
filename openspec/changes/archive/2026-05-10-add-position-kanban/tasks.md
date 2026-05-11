## 1. Frontend route and page shell

- [x] 1.1 Add lazy-loaded route `/positions/:id` in `frontend/src/App.jsx`
- [x] 1.2 Wire "Ver proceso" button in `frontend/src/components/Positions.tsx` to `useNavigate`
- [x] 1.3 Create `frontend/src/pages/PositionPage.tsx` with header (`<Position Name> Position` + chevron back-arrow)

## 2. Data layer

- [x] 2.1 Add typed services in `frontend/src/services/positionService.ts` for the three endpoints
- [x] 2.2 Add `frontend/src/hooks/usePositionBoard.ts` that fetches both endpoints in parallel and normalizes candidates by step id
- [x] 2.3 Add domain types in `frontend/src/types/position.ts`

## 3. Kanban UI

- [x] 3.1 `KanbanBoard` with `@dnd-kit/core` `DndContext` and horizontal flex layout
- [x] 3.2 `KanbanColumn` (light-gray rounded tile, header with step name + count)
- [x] 3.3 `CandidateCard` showing full name and 1–5 green dots for `averageScore`
- [x] 3.4 Loading skeleton, error state, toast feedback
- [x] 3.5 Mobile: stack columns vertically full-width below 768px

## 4. Optimistic stage updates

- [x] 4.1 `moveCandidate` in the hook updates state immediately
- [x] 4.2 On PUT failure, rollback and show error toast
- [x] 4.3 Drag-and-drop is keyboard-accessible via `@dnd-kit`'s sortable

## 5. Backend verification (verify-then-decide)

- [x] 5.1 Confirm `GET /positions/:id/interviewFlow` exists in `backend/src/routes/positionRoutes.ts`
- [x] 5.2 Confirm `GET /positions/:id/candidates` exists in `backend/src/routes/positionRoutes.ts`
- [x] 5.3 Confirm `PUT /candidates/:id/stage` exists in `backend/src/routes/candidateRoutes.ts`
- [x] 5.4 Update `backend/seed-test-data.ts` to also create `Interview` records with scores

## 6. Testing

- [x] 6.1 Create `frontend/cypress.config.ts` and `frontend/cypress/support/{e2e,commands}.ts`
- [x] 6.2 Add `cypress/e2e/position-kanban.cy.ts` covering: list → click Ver proceso → kanban renders columns → drag candidate from column A to column B → PUT called → mobile viewport stacks columns

## 7. Quality gates

- [x] 7.1 `npx tsc --noEmit` passes
- [x] 7.2 `axe-core` integration for a11y checks
- [x] 7.3 Respect `prefers-reduced-motion` in CSS
