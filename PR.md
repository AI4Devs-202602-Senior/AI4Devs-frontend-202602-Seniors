# LTI Talent Tracking System — Agentic Setup & Position Kanban

## Summary

End-to-end delivery of the **Position Kanban** feature plus an IDE-agnostic agentic toolkit (8 agents, atomic skills, atomic commands, relative symlinks into `.claude/`). Frontend was migrated CRA → Vite; the kanban consumes the existing `GET /positions/:id/interviewFlow`, `GET /positions/:id/candidates`, and `PUT /candidates/:id/stage` endpoints, with drag-and-drop stage updates, optimistic UI, and an `@dnd-kit`-based a11y story (`closestCenter` + keyboard sensor + dual-shape `over.id` handler). OpenSpec lifecycle ran end-to-end: change proposed, validated, archived; spec `position-kanban` (7 requirements) is active.

**Status**: feature works locally against the seeded DB. Type-check clean. Open items listed under "Known Limitations".

> **How to test the kanban**: open **http://localhost:3000/positions/4** directly. The list at `http://localhost:3000/positions` uses hardcoded mock cards whose ids (1, 2, 3) do not exist in the DB, so clicking "Ver proceso" from the list lands on a non-seeded position with no data. Position id `4` is the one populated by the seed (`Senior Backend Engineer`).

---

## What's New

### Agentic Toolkit (IDE-agnostic)

- **8 atomic agents** under `.claude/agents/`: `openspec-analyst`, `graphic-designer`, `frontend-developer`, `owasp-security`, `sast-pentester`, `devops`, `sql-developer`, `tester`.
- **Atomic skills** under `.claude/skills/`: OpenSpec lifecycle (init/propose/apply/archive/explore plus internal `*-change`), Vite migration, Web Vitals audit, a11y audit, OWASP checklist, SAST scan, DOMPurify/Zod guard, DnD kanban, JSDoc, Cypress/Jest bootstraps, Prisma endpoint, Chrome DevTools MCP setup, and writers for `PR.md` / `report.md`.
- **Slash commands** (10) under `.claude/commands/`: `/opsx:propose`, `/opsx:apply`, `/opsx:archive`, `/opsx:explore` (the four `opsx/*.md` files are installed by `openspec init --tools claude`; OpenSpec 1.3.x does NOT ship a `/opsx:sync` — sync semantics happen inside `archive`), `/audit:web-vitals`, `/audit:a11y`, `/audit:owasp`, `/scan:sast`, `/setup:chrome-devtools-mcp`, `/build:position-kanban`.
- **Universalization**: relative symlinks under `.cursor/`, `.windsurf/`, `.antigravity/`, `.github/copilot/` point back to `.claude/`. Recreated idempotently by `scripts/link-ai-tooling.sh`.
- **OpenSpec**: `openspec init --tools claude --force` installed the Claude integration; `openspec/config.yaml` is tuned to this repo's stack.

### OpenSpec Lifecycle Executed

- Change scaffolded with `openspec new change add-position-kanban`.
- Populated `proposal.md`, `design.md`, `tasks.md`, and the capability spec at `specs/position-kanban/spec.md` (7 ADDED requirements with Given/When/Then scenarios).
- `openspec validate add-position-kanban` ✓
- `openspec archive add-position-kanban --yes` ✓ — promoted the spec to `openspec/specs/position-kanban/spec.md`, archived the change under `openspec/changes/archive/2026-05-10-add-position-kanban/`.
- `docs/report.md` regenerated from the real `openspec list --specs` / archive state.

### Frontend

- **Vite migration**: removed `react-scripts`; added `vite` + `@vitejs/plugin-react`; `frontend/vite.config.ts` and `frontend/index.html` in place; `npm run dev` serves on port 3000.
- **Position kanban** at lazy-loaded route `/positions/:id` (added in `frontend/src/App.jsx`).
- **Pixel-perfect alignment with `docs/position.avif`**:
  - Soft gray page background; slightly lighter gray rounded column tiles (no Bootstrap `Card` shell).
  - Header is an inline `<ChevronLeft>` button followed by `<h1>{positionName} Position</h1>` (literal trailing word "Position").
  - Each candidate card shows the full name and **exactly `round(averageScore)` solid green dots** (color sampled from the avif: `#009800`). No `App ID:` line. No numeric `N/5` badge. No placeholder unfilled dots.
  - Fixed column width (`~16rem`) on desktop; columns stack full-width below 768px (per master prompt mobile requirement).
- **Drag-and-drop** (`@dnd-kit/core` + `@dnd-kit/sortable`):
  - `closestCenter` collision detection.
  - Explicit `PointerSensor` (activation distance `4px`, so clicks don't false-trigger drags) and `KeyboardSensor` with `sortableKeyboardCoordinates`.
  - `onDragEnd` resolves the target step id from BOTH `over.id` shapes — `column-{stepId}` (empty-column drop) AND `candidate-{appId}-{stepId}` (drop onto a sibling card). The previous handler only accepted the first form, which silently discarded drops onto columns that already contained candidates.
  - Optimistic UI: card moves immediately, API call fires, rollback + error toast on failure.
- **Hook** `usePositionBoard(id)` fetches both endpoints in parallel and normalizes candidates by step id (number, not name).
- **Service** `positionService.ts` with typed `getInterviewFlow`, `getCandidates`, `updateCandidateStage`.
- **Types** in `frontend/src/types/position.ts`.
- **Strict-mode TS fix**: wrapped `Object.keys(columns)` indexing into `Record<number, Candidate[]>` with `Number(stepId)` (pre-existing latent issue surfaced by the stricter Vite pipeline).
- **Reduced motion**: card transitions disabled under `prefers-reduced-motion: reduce`.

### Backend

- **Endpoints verified** (verify-then-decide; nothing re-implemented):
  - `GET /positions/:id/interviewFlow` — `backend/src/routes/positionRoutes.ts`
  - `GET /positions/:id/candidates` — `backend/src/routes/positionRoutes.ts`
  - `PUT /candidates/:id/stage` — `backend/src/routes/candidateRoutes.ts`
- **Data layer**: `backend/seed-test-data.ts` now creates a `Recruiter` `Employee` and one or more `Interview` rows per `Application`, so `averageScore = mean(interviews.score)` is non-zero on the kanban.
- **Idempotent backfill**: `backend/scripts/add-interviews.ts` adds Interview rows for any Application currently lacking them — needed when a partially-failed earlier run left Applications without Interviews (running the destructive seed again would collide on unique constraints). Run with `npx ts-node --transpile-only scripts/add-interviews.ts`.

### Testing

- **Cypress**: `frontend/cypress.config.ts` (with `env.positionId: 4`, overridable via `CYPRESS_positionId=N` or `--env positionId=N`), the missing default `cypress/support/e2e.ts` and `cypress/support/commands.ts` (their absence previously broke `cypress run`), and a happy-path spec at `cypress/e2e/position-kanban.cy.ts` that visits `/positions/${Cypress.env('positionId')}` directly — never via the mock list page — and cross-checks columns, candidate cards, `.score-dot` count, the back button's `aria-label`, the mobile `flex-direction: column`, and DnD via `pointerdown/move/up` against `cy.intercept('PUT', '/candidates/*/stage')`.
- **TypeScript**: `npx tsc --noEmit` clean for the frontend.

### Security & Quality (scaffolding)

- DOMPurify and Zod installed.
- `@axe-core/react` installed for a11y testing.
- Keyboard DnD via `@dnd-kit` keyboard sensor; focus rings via `:focus-visible`.

---

## Stack & Prerequisites

| Layer | Tech | Notes |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite + React-Bootstrap 5 | Migrated from CRA |
| DnD | `@dnd-kit/core`, `/sortable`, `/utilities` | `closestCenter` + explicit sensors |
| Backend | Express 4 + TypeScript + Prisma 5 | DDD/Hexagonal layering preserved |
| Database | PostgreSQL 14+ (Docker) | `docker compose up -d` |
| SDD | OpenSpec 1.3.1 | `openspec` global CLI |
| Testing | Cypress, Jest + ts-jest, axe-core | E2E + backend unit |
| Tooling | Chrome DevTools MCP (optional) | For debugging the frontend |

Required setup:

```bash
docker compose up -d                              # Postgres
(cd backend  && npm install && npm run prisma:generate)
(cd frontend && npm install)
```

---

## How to Run

```bash
# Terminal 1 — backend (port 3010)
cd backend && npm run dev

# Terminal 2 — frontend (port 3000, Vite)
cd frontend && npm run dev
```

Open the kanban directly:

> **http://localhost:3000/positions/4**

The `/positions` list page is intentionally left with hardcoded mock cards (ids 1, 2, 3) — those ids do **not** exist in the DB, so clicking "Ver proceso" on the list lands on a position with no `interviewFlow` and the page errors. Position id `4` is the one created by the seed (`Senior Backend Engineer`). Replacing the mock list with a real API call is a follow-up (see "Known Limitations").

### Seed / backfill the kanban data

```bash
# First-time seed on a clean DB:
cd backend && npx ts-node --transpile-only seed-test-data.ts

# If the DB already has Applications but no Interviews
# (averageScore = 0 for every candidate), backfill idempotently:
cd backend && npx ts-node --transpile-only scripts/add-interviews.ts
```

After backfill, `curl http://localhost:3010/positions/4/candidates` returns non-zero `averageScore` for every candidate.

### Testing

```bash
# Frontend type-check
cd frontend && npx tsc --noEmit

# Cypress E2E (requires both servers + seeded DB; defaults to /positions/4)
cd frontend && npm run cypress:run

# To target a different seeded position:
cd frontend && CYPRESS_positionId=7 npm run cypress:run
# or: cd frontend && npx cypress run --env positionId=7

# OpenSpec
openspec list --specs
openspec show position-kanban
```

---

## Folder & File Reference

| Path | Purpose |
|---|---|
| `.claude/agents/*.md` × 8 | Canonical specialist agents |
| `.claude/skills/**/SKILL.md` | Atomic skills |
| `.claude/commands/*.md` | Slash commands (`/opsx:*`, `/audit:*`, …) |
| `.cursor/`, `.windsurf/`, `.antigravity/`, `.github/copilot/` | Relative symlinks into `.claude/` |
| `scripts/link-ai-tooling.sh` | Idempotent symlink installer |
| `openspec/config.yaml` | Project context + conventions for OpenSpec |
| `openspec/specs/position-kanban/spec.md` | Active capability spec (7 requirements) |
| `openspec/changes/archive/2026-05-10-add-position-kanban/` | Archived change (proposal, design, tasks, spec delta) |
| `AGENTS.md` | Codebase analysis (architecture, design tokens, tests) |
| `CLAUDE.md` | Single-line relative pointer to `AGENTS.md` |
| `frontend/vite.config.ts`, `frontend/index.html` | Vite migration entry points |
| `frontend/src/App.jsx` | Router; lazy `/positions/:id` route |
| `frontend/src/pages/PositionPage.tsx` | Kanban page shell + heading + back chevron |
| `frontend/src/components/Kanban/KanbanBoard.tsx` | `DndContext` + sensors + `closestCenter` + dual-shape `over.id` handler |
| `frontend/src/components/Kanban/KanbanColumn.tsx` | Gray tile, droppable body, sortable context |
| `frontend/src/components/Kanban/CandidateCard.tsx` | Name + N green dots |
| `frontend/src/components/Kanban/{LoadingSkeleton,ErrorState,Toast}.tsx` | UX states |
| `frontend/src/hooks/usePositionBoard.ts` | Parallel fetch + optimistic `moveCandidate` |
| `frontend/src/services/positionService.ts` | Typed Axios client |
| `frontend/src/types/position.ts` | Domain types |
| `frontend/src/styles/PositionPage.css` | Gray-on-gray, fixed column width, mobile stack, reduced-motion |
| `frontend/cypress.config.ts` | Cypress config |
| `frontend/cypress/support/{e2e,commands}.ts` | Default supportFile (was missing) |
| `frontend/cypress/e2e/position-kanban.cy.ts` | Baseline E2E |
| `backend/src/routes/positionRoutes.ts` | `GET /positions/:id/{interviewFlow,candidates}` |
| `backend/src/routes/candidateRoutes.ts` | `PUT /candidates/:id/stage` |
| `backend/seed-test-data.ts` | Creates Position 4 + 5 candidates + Interviews with scores |
| `backend/scripts/add-interviews.ts` | Idempotent Interview backfill |
| `docs/report.md` | OpenSpec run report |
| `prompts/prompts-JCMM.md` | Master orchestration prompt (re-runnable) |

---

## Functionality

### Position Kanban (`/positions/:id`)

1. Header: chevron-left button (returns to `/positions`) + `<Position Name> Position` title.
2. One column per interview step from `GET /positions/:id/interviewFlow`, ordered by `orderIndex`.
3. Each candidate from `GET /positions/:id/candidates` renders in the column whose `id` matches their `currentInterviewStep` (a number — the FK, not the step name).
4. Card content: full name + N solid green dots (`#009800`) where `N = round(averageScore)`. No badge, no App ID.
5. Drag-and-drop:
   - Pointer or keyboard.
   - Optimistic move on drop.
   - `PUT /candidates/:id/stage` with `{ applicationId, currentInterviewStep }`.
   - Rollback + error toast if the API rejects.
6. Mobile (< 768px): columns stack vertically full-width.
7. Reduced-motion respected: card transitions disabled.

---

## Changes Summary

| Area | Change |
|---|---|
| Build | CRA → Vite migration; `frontend/vite.config.ts`, `index.html`, scripts. |
| Frontend kanban | New route, page, hook, service, types, components, styles. Pixel-perfect to `docs/position.avif`. |
| DnD | `closestCenter` + `PointerSensor(distance:4)` + `KeyboardSensor`; `over.id` accepts `column-*` and `candidate-*-*`; early-return on same-step. |
| Backend | No new endpoints required; verified existing routes. Seed extended with Interview rows + a Recruiter Employee. |
| Backfill | New `backend/scripts/add-interviews.ts` for partially-seeded DBs (idempotent). |
| Cypress | Added the missing default `support/e2e.ts` + `support/commands.ts`. Spec rewritten to target `/positions/${Cypress.env('positionId')}` directly (default `positionId: 4`, overridable) and cross-check live API responses for columns, candidates, dot counts, DnD, and mobile stacking. |
| TypeScript | Strict-mode index fix in `usePositionBoard.ts`; `npx tsc --noEmit` clean. |
| OpenSpec | Real lifecycle ran — change archived, spec promoted (7 requirements). |
| Tooling | 8 agents, atomic skills/commands, IDE symlinks, `AGENTS.md`, `CLAUDE.md`. |
| Prompt | `prompts/prompts-JCMM.md` hardened with mandatory gates (G1–G9) and concrete pixel-perfect / DnD / seed contracts so re-runs reproduce this result. |

---

## Verification Snapshot

| Check | Status | Evidence |
|---|---|---|
| `cd frontend && npx tsc --noEmit` | ✓ pass | No errors. |
| `openspec validate add-position-kanban` (pre-archive) | ✓ pass | `Change 'add-position-kanban' is valid` |
| `openspec validate position-kanban --type spec` (post-archive) | ✓ pass | `Specification 'position-kanban' is valid` |
| `openspec list --specs` | ✓ pass | `position-kanban     requirements 7` |
| `ls openspec/changes/archive/` | ✓ pass | `2026-05-10-add-position-kanban` |
| `ls frontend/cypress/support/` | ✓ pass | `e2e.ts`, `commands.ts` present |
| Symlinks under `.cursor/`, `.windsurf/`, `.antigravity/`, `.github/copilot/` | ✓ pass | All resolve into `.claude/` |
| `curl localhost:3010/positions/4/candidates` | ✓ pass | At least one `averageScore > 0` after backfill (max=4). |
| Kanban DnD cross-column (with cards already in target) | ✓ pass | Manual smoke; fixed after switching to `closestCenter` + dual-shape `over.id`. |
| Pixel-perfect (dot count, color `#009800`, no badge / no App ID, "Position" suffix) | ✓ pass | Matches `docs/position.avif`. |

---

## Known Limitations & Deferred Work

1. **Positions list is mock data.** `frontend/src/components/Positions.tsx` renders three hardcoded cards (ids 1–3) that don't exist in the DB. The only way to exercise the kanban today is to open `/positions/4` directly. Replacing the mock list with `GET /positions` is the obvious follow-up.
2. **Cypress E2E not executed end-to-end** in this session — the default-supportFile error is fixed and `npx tsc --noEmit` passes, but a full `cypress run` with both servers up has not been recorded here.
3. **Lighthouse a11y score / `axe-core` audit** not captured in this run.
4. **`semgrep` / `eslint-plugin-security` / `npm audit`** results not captured in this run. DOMPurify and Zod are installed but not wired at boundaries beyond the kanban.
5. **Backend Express security headers** (CSP, HSTS, X-Frame-Options, Referrer-Policy) are documented in `prompts/prompts-JCMM.md` §15 but not yet applied in `backend/src/index.ts`.
6. **Chrome DevTools MCP** is documented as optional; not installed in this repo.
7. **The Positions list still navigates with `index + 1`**, so even after wiring real data, the click handler will need to use the real position id from the API.

---
