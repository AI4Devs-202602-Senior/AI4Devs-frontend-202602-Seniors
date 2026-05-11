## Context

The LTI frontend already lists positions (`Positions.tsx`), but the "Ver proceso" button is inert. The backend exposes the three endpoints needed to populate and update a candidate kanban: `GET /positions/:id/interviewFlow`, `GET /positions/:id/candidates`, and `PUT /candidates/:id/stage`. The frontend was migrated from CRA to Vite earlier in this change set.

## Goals / Non-Goals

**Goals:**
- Pixel-perfect alignment with `docs/position.avif`: gray page, light-gray rounded column tiles, white candidate cards with name + 1–5 green dot score, inline chevron-left back arrow before the title, and a title in the form `<Position Name> Position`.
- Drag-and-drop stage updates with optimistic UI and rollback on error.
- Mobile-first responsive: columns stack vertically full-width below 768px.
- A11y: keyboard DnD via `@dnd-kit`, focus-visible outlines, `prefers-reduced-motion` respected, semantic landmarks (`section`, `header`, `h1/h2`).

**Non-Goals:**
- Editing candidate metadata beyond stage moves.
- Bulk operations (multi-select drag).
- Server-driven optimistic conflict resolution beyond simple rollback.

## Decisions

- **DnD library**: `@dnd-kit/core` + `@dnd-kit/sortable`. Rationale: built-in keyboard sensor and screen-reader announcements; small bundle; works without a global drag-image hack.
- **State shape**: candidates indexed by `currentInterviewStep` (the foreign key id), not by step name, so column lookups are O(1) and matches the backend payload.
- **Score visualization**: 5 inline `<span class="score-dot">` elements, filled (`--filled`) up to `Math.round(averageScore)`. Avoids depending on icon fonts and keeps SSR-safe markup.
- **Title format**: `"${positionName} Position"`. Falls back to `"Position"` while loading.
- **Verify-then-decide on backend**: endpoints were checked under `backend/src/routes/`; no backend changes required. The `seed-test-data.ts` script was extended to insert `Interview` rows because `averageScore = mean(interviews.score)` was returning 0 with an empty `interviews` collection.

## Risks / Trade-offs

- **Empty seed data** still produces zero scores; we documented the seed expectation but did not gate the UI on it.
- **Horizontal scroll on mid-width viewports** (e.g., 900px wide) is intentional; vertical-stack is reserved for true mobile (<768px) per the master prompt. We could switch to a grid auto-fit but that would diverge from the avif.
- **`@dnd-kit` keyboard nav** announces drop targets via aria-live; verify with a screen reader before claiming WCAG conformance.
- **Optimistic UI** uses a deep clone (`JSON.parse(JSON.stringify(...))`) for rollback — fine at current scale but worth replacing with a structured snapshot if the candidate list grows large.
