# Prompt — LTI Talent Tracking System: Agentic Setup & Position Kanban Build

> Self-contained, English, Markdown master prompt. When executed by a capable agentic IDE (Claude Code, Cursor, Antigravity, Windsurf, …), this prompt drives the full setup of modular AI tooling **and** the implementation of the Position detail (kanban) feature, producing a `PR.md` summary and a `docs/report.md` audit. Do not require reading any other prompt file.

---

## 0. Mandatory Gates (DO NOT SKIP)

These gates have failed silently in previous executions. Each one MUST be verified before the run is declared complete. If a gate fails, fix it before moving on — do not paper over with stub text.

| # | Gate | Hard verification command | Pass criterion |
|---|---|---|---|
| G1 | OpenSpec scaffold | `test -d openspec/specs && test -d openspec/changes` | Both directories exist (created by `openspec init --tools claude --force`) |
| G2 | OpenSpec lifecycle ran | `openspec list --specs \| grep position-kanban` and `ls openspec/changes/archive/ \| grep position-kanban` | Spec is present **and** the change has been archived (propose → validate → archive). Do NOT claim completion by writing prose that says "OpenSpec is scaffolded for future use" — actually run `openspec new change`, `openspec validate <name>`, and `openspec archive <name> --yes`. |
| G3 | Cypress runnable | `cd frontend && npx cypress run --spec cypress/e2e/position-kanban.cy.ts` (with backend stubbed) does NOT fail with `Your project does not contain a default supportFile` | Files `frontend/cypress/support/e2e.ts` AND `frontend/cypress/support/commands.ts` exist. `cypress.config.ts` either points at them or sets `supportFile: false`. |
| G4 | Seed produces non-zero scores | `docker compose up -d && (cd backend && npm run ts-node seed-test-data.ts)` followed by `curl localhost:3010/positions/1/candidates \| jq '.[].averageScore'` | At least one candidate has `averageScore > 0`. Seeds MUST insert `Interview` rows tied to each `Application` because the backend computes `mean(interviews.score)` and returns 0 for empty interview collections. |
| G5 | Pixel-perfect kanban | Manual diff against `docs/position.avif` | Title is `<Position Name> Position` (the literal word " Position" appended). Inline `<ChevronLeft>` button precedes the title. Each candidate card shows the candidate name and **N filled green dots out of 5** for `averageScore` — NOT a numeric `4/5` badge, and NOT an `App ID:` sublabel. Page background is a soft gray; column tiles are a slightly lighter gray with rounded corners. Card width is fixed (~16rem on desktop). |
| G6 | TypeScript clean | `cd frontend && npx tsc --noEmit` | Exit code 0. |
| G7 | Symlinks resolve | `for d in .cursor .windsurf .antigravity .github/copilot; do find "$d" -maxdepth 3 -type l -exec readlink -f {} \;; done` | Every symlink points back into `.claude/`. |
| G8 | Kanban DnD works cross-column with cards present | Manual: drag a card from a column with ≥ 2 candidates onto a column that already has ≥ 1 candidate; the API call to `PUT /candidates/:id/stage` fires and the card moves. | Drop targets MUST resolve when the drop lands on a sibling candidate, not only on the column itself (dnd-kit's collision detection often reports `over.id` as another candidate). Use `closestCenter` and an `over.id`-aware handler that accepts both `column-{stepId}` and `candidate-{appId}-{stepId}`. |
| G9 | `averageScore > 0` for at least one candidate after seed **or** backfill | `curl localhost:3010/positions/<id>/candidates \| jq '[.[].averageScore] \| max'` returns a value > 0 | Seeding on a clean DB is not enough — if Applications already exist without Interviews (e.g., from an earlier partial run), running the seed again throws unique-constraint errors and the kanban still shows zero. Provide an **idempotent backfill** script (`backend/scripts/add-interviews.ts`) that inserts Interview rows only for Applications with `interviews.length === 0`. |
| G10 | Every `.claude/commands/*.md` is wired to a real agent or CLI tool | `agents=$(ls .claude/agents/ \| sed 's/\.md$//' \| tr '\n' '\|' \| sed 's/\|$//'); find .claude/commands -name '*.md' -type f \| while read f; do grep -qE "($agents)\|openspec \|semgrep " "$f" \|\| echo "ORPHAN: $f"; done` returns nothing | Commands cannot reference removed/renamed agents or skills, and the canonical OpenSpec `opsx/*` commands (which drive the `openspec` CLI directly) are allowed. Also: do NOT keep both flat `opsx-*.md` and `opsx/*.md` — the OpenSpec install owns the `opsx/` namespace, the flat files duplicate it. |
| G11 | At least one slash command was actually invoked during the run | The run log shows the orchestrator dispatched via at least one `/<ns>:<name>` slash command (e.g., `/build:position-kanban`, `/opsx:propose`, `/scan:sast`), not only via direct Bash CLI calls. | Slash commands are the documented public API of the toolkit. If a run produces every artifact without ever invoking one, the commands are dead code and the gap between "stated workflow" and "actual workflow" widens silently. Future runs MUST drive at least one phase through a slash command and record it in `docs/report.md`. |

A "completed" run that does not pass every gate above is incomplete. Reopen the failing gate, fix it, then proceed.

## 1. Role & Operating Principles

You are a **senior agentic-IDE engineer**. Operate under these principles:

- **YAGNI first.** Add patterns, abstractions, and dependencies only when justified by a current requirement.
- **Atomicity.** Each agent, skill, and command owns a single concern. Small files, narrow tools, sharp triggers.
- **Parallelize.** When two steps are independent, dispatch them as parallel sub-agent calls.
- **Token discipline.** Load only what the current step needs. Prefer reading specific files at specific line ranges over wholesale exploration.
- **Pixel-perfect reuse.** When implementing UI, reuse the project's existing visual components before introducing new ones, but match the design reference (`docs/position.avif`) literally — colors, spacing, card width, score visualization.
- **Trust but verify.** Sub-agent summaries describe intent, not result; check the diff and run the verification gate before proceeding.
- **Run, don't narrate.** Run the OpenSpec workflow invoking the CLI. Writing "OpenSpec is scaffolded for future feature proposals" without running `openspec new change`/`openspec validate`/`openspec archive` is a failed run.

---

## 2. Mission

Set up an IDE-agnostic agentic toolkit (8 expert agents, atomic skills, atomic commands) under a single canonical root with relative symlinks to other IDE folders, and use it to deliver the **Position detail (kanban)** feature end-to-end. The mission spans these tracks, mapped to the 16 phases listed in §9:

- Install and configure **OpenSpec**; write `openspec/config.yaml`.
- Generate **`AGENTS.md`** (codebase analysis) and **`CLAUDE.md`** (relative pointer to `AGENTS.md`).
- Apply **DDD + Hexagonal** with selectively used patterns, JSDoc/TSDoc on public APIs, Core Web Vitals, lazy loading, **Vite migration**, OWASP/SAST, **WCAG 2.2 AA**, mobile-first responsiveness.
- Drive the OpenSpec workflow `/opsx:propose → /opsx:apply → /opsx:archive` for the Position kanban spec (`/opsx:sync` is **not** installed by OpenSpec 1.3.x — the install ships `propose`, `apply`, `archive`, `explore`; sync semantics happen inside `archive`).
- Produce **`PR.md`** and **`docs/report.md`** capturing the run.

---

## 3. Project Snapshot (frozen facts)

| Layer | Tech | Notes |
|---|---|---|
| Frontend | React 18 + TypeScript, **migrating CRA → Vite** | React-Bootstrap 5 + Bootstrap 5.3, React Router v6, react-bootstrap-icons. Stay on React-Bootstrap; do **not** introduce Tailwind. |
| Backend | Express 4 + TypeScript, Prisma 5 | Layered (`application/services`, `domain/models`, `presentation/controllers`, `routes`). Jest 29 + ts-jest. |
| Database | PostgreSQL 14+ | Dockerized via `docker-compose.yml`. |
| E2E | None today → add **Cypress** | Frontend E2E. |
| Ports | 3000 frontend, 3010 backend | |

Key existing files:

- `frontend/src/components/Positions.tsx` — list page with mock data and a non-functional **Ver proceso** button (line ~60). Entry point for the kanban work.
- `frontend/src/App.js` — React Router v6 route table. Add `/positions/:id` here.
- `frontend/package.json` — current scripts use `react-scripts`; replace with Vite.
- `backend/src/domain/models/Position.ts` — Position model already includes `interviewFlow.interviewSteps`.
- `backend/src/routes/` — verify whether kanban endpoints exist (see §13).
- `backend/prisma/schema.prisma` — Prisma schema source of truth.
- `docs/positions.avif`, `docs/position.avif` — design references (pixel-perfect targets).
- `docker-compose.yml`, `README.md` — environment + ports.

---

## 4. Quality Bars

Non-negotiable acceptance gates:

- **Core Web Vitals**: LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- **Accessibility**: WCAG 2.2 AA minimum. Semantic HTML before ARIA. Contrast ≥ 4.5:1. Full keyboard nav with visible focus. Respect `prefers-reduced-motion`. Labels on inputs, `alt` on images, landmarks (`<nav>`, `<main>`, `<aside>`).
- **Security**: OWASP Top 10 review; **DOMPurify** for any HTML; **Zod** (or Valibot) for input schemas; never `dangerouslySetInnerHTML` without sanitization; no secrets in the bundle; `npm audit` clean for high+; security headers (CSP, SRI for CDN assets, HSTS, X-Frame-Options, Referrer-Policy) configured at the Express layer.
- **Tests**: Jest backend coverage > 80 %; Cypress E2E green for the kanban happy path + drag-and-drop.
- **Documentation**: JSDoc/TSDoc on all public APIs (services, hooks, controllers, repositories).
- **Lazy loading**: heavy components via `React.lazy`; LCP image gets `fetchpriority="high"` and `<link rel="preload">`; non-LCP images use `loading="lazy"`.
- **Bundling**: Vite with minification (`build.minify: 'oxc'`).

---

## 5. Universalization Strategy (IDE-agnostic via relative symlinks)

Canonical content lives under **`.claude/`** and at the repo root (`AGENTS.md`, `CLAUDE.md`). Other IDE roots are populated with **relative symlinks** so a single edit propagates everywhere.

Symlink targets to create (relative to each symlink's directory):

| Source (IDE folder) | Target |
|---|---|
| `.cursor/rules/` | `../../.claude/agents/` |
| `.cursor/commands/` | `../../.claude/commands/` |
| `.windsurf/agents/` | `../.claude/agents/` |
| `.windsurf/commands/` | `../.claude/commands/` |
| `.antigravity/agents/` | `../.claude/agents/` |
| `.antigravity/commands/` | `../.claude/commands/` |
| `.github/copilot/agents/` | `../../.claude/agents/` |
| `.github/copilot/commands/` | `../../.claude/commands/` |

Provide an idempotent script `scripts/link-ai-tooling.sh` that:

1. Creates parent directories if missing.
2. Removes only stale symlinks (never real files).
3. Re-creates each symlink with `ln -s` using paths relative to the symlink's location.
4. Re-runs cleanly on macOS/Linux. On Windows, emit `scripts/link-ai-tooling.cmd` using `mklink /D` and document the deviation in `PR.md`.

The script must be tested by running it twice and asserting no diff on the second run.

---

## 6. Atomic Roles — 8 Agents at `.claude/agents/<slug>.md`

Each agent file uses YAML frontmatter:

```yaml
---
name: <slug>
description: <one-line trigger description used by the dispatcher>
model: sonnet                 # or haiku/opus per scope; default sonnet
tools: [Read, Grep, Glob, Bash, Edit, Write]   # narrow per role
---
```

followed by a tight system prompt (≤ 60 lines) and a **When to invoke** trigger list.

| Slug | Concern | Tools (typical) |
|---|---|---|
| `openspec-analyst` | Owns OpenSpec lifecycle: init, propose, apply, sync, archive. Ensures `openspec/config.yaml` reflects the real stack and produces well-formed specs/changes. | Read, Write, Edit, Bash |
| `graphic-designer` | Pixel-perfect translation from `docs/*.avif` to React-Bootstrap components. Owns tokens (Bootstrap variables), spacing, typography, contrast. | Read, Write, Edit |
| `frontend-developer` | Implements React 18 + TS code: hooks, services, components, routing, lazy loading. Targets Web Vitals. | Read, Write, Edit, Bash |
| `owasp-security` | Reviews against OWASP Top 10. Wires DOMPurify, Zod, security headers, secret scanning. | Read, Grep, Edit |
| `sast-pentester` | Runs SAST scans (e.g., `semgrep`, `eslint-plugin-security`, `npm audit`). Produces a remediation list. | Bash, Read, Edit |
| `devops` | Vite migration, scripts, Docker integration, CI hooks, Dependabot config, `chrome-devtools-mcp` setup. | Read, Write, Edit, Bash |
| `sql-developer` | Prisma schema, repositories, queries, migrations, snake_case columns, integrity. | Read, Write, Edit, Bash |
| `tester` | Jest backend unit tests, Cypress E2E, fixtures, test data, coverage gating, axe-core a11y checks. | Read, Write, Edit, Bash |

Cross-cutting work (e.g., a kanban feature) is orchestrated by routing to multiple agents in parallel where independent.

---

## 7. Atomic Skills — `.claude/skills/<slug>/SKILL.md`

Each skill is a short checklist a single agent can execute. Frontmatter:

```yaml
---
name: <slug>
description: <one-line trigger>
allowed-tools: [Read, Edit, Bash]
---
```

Skill catalog (create one file per row). **Note**: `openspec init --tools claude --force` will additionally drop its own `openspec-apply-change`, `openspec-archive-change`, and `openspec-explore` skills into `.claude/skills/`. Treat those as part of the expected output; do not delete them.

| Slug | Purpose |
|---|---|
| `openspec-init` | Install OpenSpec per https://github.com/Fission-AI/OpenSpec/#quick-start, scaffold `openspec/` |
| `openspec-propose` | Create a proposal under `openspec/changes/` with problem, scope, benefits, test plan |
| `openspec-apply` | Apply an approved proposal: design, schema, deps, steps, test plan |
| `openspec-sync` | Update specs to match shipped behavior with help from related agents |
| `openspec-archive` | Archive completed change, keep version history |
| `vite-migrate` | Replace CRA toolchain with Vite (`vite`, `@vitejs/plugin-react`), preserve TS, set `build.minify: 'oxc'`, port scripts |
| `web-vitals-audit` | Measure LCP/INP/CLS; remediate via lazy loading, preload, image priorities |
| `a11y-audit` | Run axe-core, `eslint-plugin-jsx-a11y`, Lighthouse a11y; fix to ≥ 95 |
| `owasp-checklist` | Walk OWASP Top 10 against the diff; produce findings + fixes |
| `sast-scan` | Run SAST (`semgrep ci`, `npm audit`), triage, fix |
| `dompurify-zod-guard` | Add DOMPurify wherever HTML is rendered; add Zod schemas at form/API boundaries |
| `dnd-kanban` | Implement drag-and-drop with `@dnd-kit/core` (a11y- and mobile-friendly) over React-Bootstrap cards |
| `jsdoc-public-api` | Add JSDoc/TSDoc to every exported function/class/hook |
| `cypress-e2e-bootstrap` | Install Cypress, configure `baseUrl: http://localhost:3000`, expose `env.positionId` (default to the seeded id) overridable via `CYPRESS_positionId=N` or `--env positionId=N`, add the default supportFile pair (`cypress/support/{e2e,commands}.ts`), and a base spec that visits `/positions/${Cypress.env('positionId')}` directly — never via the mock list page |
| `jest-backend-bootstrap` | Ensure Jest+ts-jest config, add coverage threshold > 80 %, write controller/service tests |
| `prisma-endpoint` | Add a missing Express+Prisma endpoint under DDD/Hexagonal with repository + service + controller + Jest |
| `chrome-devtools-mcp-setup` | Install per https://github.com/ChromeDevTools/chrome-devtools-mcp/#mcp-client-configuration (CLI, MCP only) |
| `pr-md-writer` | Render `PR.md` from the §17 template using observed run data |
| `report-md-writer` | Capture `openspec view` output and run summary into `docs/report.md` (§18) |

---

## 8. Atomic Commands — `.claude/commands/<slug>.md`

Slash entry points exposed to the user. Each command file:

```yaml
---
name: <slug>
description: <one-line>
argument-hint: "<args>"
---
```

followed by a short orchestration body that names the agents/skills it dispatches.

| Command | File | Dispatches | Notes |
|---|---|---|---|
| `/opsx:propose` | `opsx/propose.md` | OpenSpec CLI directly | Installed by `openspec init --tools claude` — do NOT duplicate as a flat `opsx-propose.md` |
| `/opsx:apply` | `opsx/apply.md` | OpenSpec CLI directly | Installed by `openspec init --tools claude` |
| `/opsx:archive` | `opsx/archive.md` | OpenSpec CLI directly | Installed by `openspec init --tools claude` |
| `/opsx:explore` | `opsx/explore.md` | OpenSpec CLI directly | Installed by `openspec init --tools claude` |
| `/audit:web-vitals` | `audit-web-vitals.md` | `frontend-developer` + `web-vitals-audit` | |
| `/audit:a11y` | `audit-a11y.md` | `frontend-developer` + `a11y-audit` | |
| `/audit:owasp` | `audit-owasp.md` | `owasp-security` + `owasp-checklist` | |
| `/scan:sast` | `scan-sast.md` | `sast-pentester` + `sast-scan` | |
| `/setup:chrome-devtools-mcp` | `setup-chrome-devtools-mcp.md` | `devops` + `chrome-devtools-mcp-setup` | |
| `/build:position-kanban` | `build-position-kanban.md` | parallel: `graphic-designer`, `frontend-developer`, `sql-developer`; serial: `tester`, `owasp-security`, `sast-pentester` | Drives §13 end-to-end |

---

## 9. Phase Map (16 phases, parallelism marked `[parallel]`)

| # | Phase | Owner | Helpers | Skills | Output | Gate |
|---|---|---|---|---|---|---|
| 1 | OpenSpec install + `config.yaml` | `openspec-analyst` | `devops` | `openspec-init` | `openspec/`, `openspec/config.yaml` (per §10) | `test -d openspec/specs && test -d openspec/changes` — see Gate G1 |
| 2 | Codebase analysis → `AGENTS.md` | `openspec-analyst` | `frontend-developer`, `sql-developer` | — | `AGENTS.md` (per §11) | Sections complete |
| 3 | `CLAUDE.md` pointer | `openspec-analyst` | — | — | `CLAUDE.md` containing `./AGENTS.md` | File exists, single line |
| 4 | DDD/Hexagonal application | `frontend-developer`, `sql-developer` | `openspec-analyst` | — | Refactor where required by §13 | YAGNI check |
| 5 | JSDoc/TSDoc on public APIs | `frontend-developer`, `sql-developer` | — | `jsdoc-public-api` | Docstrings on exports | grep no public symbol missing |
| 6 | Core Web Vitals targets | `frontend-developer` | — | `web-vitals-audit` | LCP/INP/CLS within budgets | Lighthouse |
| 7 | Lazy loading | `frontend-developer` | — | — | `React.lazy`, `loading="lazy"`, LCP `fetchpriority`+preload | Visible in code |
| 8 | Vite migration with minify | `devops` | `frontend-developer` | `vite-migrate` | `frontend/vite.config.ts`, scripts updated | `npm run build` ok |
| 9 | Cybersecurity (OWASP+headers+inputs) `[parallel with 10–12]` | `owasp-security` | `frontend-developer` | `dompurify-zod-guard`, `owasp-checklist`, `sast-scan` | Headers, sanitization, schemas, audit clean | `npm audit` clean (high+) |
| 10 | Responsive + mobile-first `[parallel]` | `graphic-designer` | `frontend-developer` | — | Bootstrap utilities + CSS `@container` where needed | Viewport tests |
| 11 | a11y WCAG 2.2 AA `[parallel]` | `graphic-designer`, `frontend-developer` | `tester` | `a11y-audit` | axe-core + Lighthouse a11y ≥ 95 | Score met |
| 12 | Navigation: hierarchy, breadcrumbs, skip-links `[parallel]` | `graphic-designer` | `frontend-developer` | — | Skip link + breadcrumbs in long flows | Manual + axe |
| 13 | Visual feedback (hover/focus, skeletons, optimistic UI, toasts) | `graphic-designer` | `frontend-developer` | — | Hover/focus, skeleton, optimistic stage update | Visible |
| 14 | Chrome DevTools MCP install | `devops` | — | `chrome-devtools-mcp-setup` | MCP entry registered | `claude mcp list` shows it |
| 15 | OpenSpec flow for Position kanban: **`openspec new change add-position-kanban` → fill proposal/design/tasks/specs → `openspec validate add-position-kanban` → `openspec archive add-position-kanban --yes`** | `openspec-analyst` | parallel: `graphic-designer`, `frontend-developer`, `sql-developer`, `tester` | `openspec-propose`, `openspec-apply`, `openspec-sync`, `openspec-archive`, `dnd-kanban`, `cypress-e2e-bootstrap`, `jest-backend-bootstrap`, `prisma-endpoint` (conditional) | Feature shipped per §13 spec | Gate G2 (spec listed + change archived); Cypress green; Jest ≥ 80 % |
| 16 | `docs/report.md` from `openspec view` | `openspec-analyst` | — | `report-md-writer` | `docs/report.md` | File exists |

After phase 16: run `pr-md-writer` to render `PR.md` (see §17).

---

## 10. OpenSpec Wiring — `openspec/config.yaml`

Write the file below verbatim, adjusting only if the codebase reveals a more accurate fact:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  # Project Context — LTI Talent Tracking System

  ## Tech Stack
  - Runtime: Node.js (LTS)
  - Package Manager: npm
  - Frontend: React 18 + TypeScript, Vite (migrated from CRA), React-Bootstrap 5
  - Backend: Express 4 + TypeScript, Prisma 5
  - Database: PostgreSQL 14+ (Docker)
  - Testing: Jest + ts-jest (backend), Cypress (frontend E2E), React Testing Library (frontend unit)
  - SDD: OpenSpec

  ## API Standards
  - RESTful API, JSON responses
  - Error response shape: { error, code, message }
  - Endpoints versioned under /api/v1/ when newly added; existing endpoints preserved as-is unless a proposal renames them
  - Authentication via JWT in the Authorization header

  ## Coding Conventions
  - ES2022+ / TypeScript
  - snake_case for database columns
  - camelCase for JavaScript/TypeScript variables and functions
  - Descriptive names for functions and variables
  - Tests for all new features (minimum 80% coverage)
  - JSDoc/TSDoc on all public APIs (services, hooks, controllers, repositories)

  ## Project Structure
  - frontend/src/: React app (components, pages, hooks, services, types)
  - backend/src/: Layered DDD/Hexagonal (application, domain, infrastructure, presentation, routes)
  - openspec/: Source of truth for specs and proposals
  - openspec/specs/: Current system specifications
  - openspec/changes/: Proposed changes / features in development
  - docs/: Reference assets and reports

  ## Development Workflow
  - Create proposals before implementation (/opsx:propose)
  - Apply with /opsx:apply; archive (which updates the active specs) with /opsx:archive
  - Keep specs aligned with shipped behavior
  - All changes pass review; tests must pass before merge

  ## Testing Conventions
  - Backend: Jest unit + integration tests
  - Frontend: Cypress E2E for user flows; React Testing Library for component units
  - Coverage: > 80%
  - Each new feature defines a layered testing strategy

rules:
  proposal:
    - Include a clear problem statement
    - Specify scope and timeline
    - Outline benefits and trade-offs
    - Declare test types: Jest backend unit/integration; Cypress E2E for the frontend

  design:
    - Document all API endpoints with examples
    - Include database schema changes (Prisma migrations)
    - Specify new dependencies needed
    - Outline implementation steps
    - Document the planned location of tests
    - Specify required mocks, fixtures, and test data
    - Define how the contract between React frontend and Express backend is validated (Zod schemas, API tests)

  spec:
    - Use clear, declarative language
    - Document all features and behaviors
    - Include examples where relevant
    - Keep version history with dates
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
    - Separate backend coverage (Jest) and frontend E2E (Cypress)

  tasks:
    - Break down into atomic, testable units
    - Include estimated effort for each task
    - Mark dependencies between tasks
    - Include QA and documentation tasks
    - Each new feature must include unit and integration tests
    - Define test cases in design.md before implementation starts
    - Include explicit Jest backend unit test tasks
    - Include explicit Cypress frontend E2E test tasks
```

---

## 11. `AGENTS.md` Blueprint

Generate at repo root with these sections (fill from a real codebase scan that excludes anything in `.gitignore`):

1. **Business purpose** — what LTI does and the user roles served.
2. **Folder map** — tree of `frontend/`, `backend/`, `docs/`, `openspec/`, `prompts/`, `scripts/`, top-level configs. Annotate each folder's role.
3. **Design tokens** — Bootstrap variables in use (colors, spacing, breakpoints, typography). List any custom CSS variables.
4. **Tech stack** — per §3 table, plus Node version found in `.nvmrc` / `engines`.
5. **Frontend architecture** — routing, services, hooks, components, state management, error boundaries, lazy boundaries.
6. **Backend architecture** — DDD/Hexagonal layering, Prisma schema highlights, route map, middleware, error model.
7. **Data model summary** — top entities and relations from `schema.prisma`.
8. **Testing strategy** — Jest config, coverage thresholds, Cypress config, fixtures, CI commands.
9. **Operational notes** — `docker-compose.yml`, ports, env vars, seed scripts.

Keep concise; link to authoritative files rather than duplicating contents.

---

## 12. `CLAUDE.md` Blueprint

Single-line file at repo root pointing to `AGENTS.md` via **relative path**:

```
./AGENTS.md
```

Nothing else. Do not duplicate `AGENTS.md` content here.

---

## 13. Position Kanban Spec — Functional Brief (verbatim) + Verify-then-Decide

> Build the feature exactly as described, **reusing existing React-Bootstrap components** (cards, badges, buttons, icons) for visual continuity with `Positions.tsx` and the references `docs/positions.avif` / `docs/position.avif`.

**Goal (EN).** From the existing Positions list page, clicking the **"Ver proceso"** button on any position card opens the detail page `position` for that position. The detail page provides a **kanban interface** to visualize and manage candidates by interview phase, with drag-and-drop to update a candidate's stage.

**Design requirements.**

- Show the position title at the top for context.
- Add a back-arrow at the left of the title to return to the positions list.
- One column per interview step in the process.
- Each candidate card sits in the column of their current step and shows **full name** and **average score**.
- Mobile: phases stack vertically, full-width.

**Notes.**

- Assume the global page chrome (top menu, footer) already exists; build only the page contents.
- Reuse the existing visual components (React-Bootstrap, badges, icons) rather than introducing a new design system.

**API endpoints used by the page.**

```
GET /positions/:id/interviewFlow
{
  "positionName": "Senior backend engineer",
  "interviewFlow": {
    "id": 1,
    "description": "Standard development interview process",
    "interviewSteps": [
      { "id": 1, "interviewFlowId": 1, "interviewTypeId": 1, "name": "Initial Screening", "orderIndex": 1 },
      { "id": 2, "interviewFlowId": 1, "interviewTypeId": 2, "name": "Technical Interview", "orderIndex": 2 },
      { "id": 3, "interviewFlowId": 1, "interviewTypeId": 3, "name": "Manager Interview", "orderIndex": 2 }
    ]
  }
}

GET /positions/:id/candidates
[
  { "fullName": "Jane Smith",   "currentInterviewStep": "Technical Interview",  "averageScore": 4 },
  { "fullName": "Carlos García","currentInterviewStep": "Initial Screening",   "averageScore": 0 },
  { "fullName": "John Doe",    "currentInterviewStep": "Manager Interview",   "averageScore": 5 }
]

PUT /candidates/:id/stage
Request:  { "applicationId": "1", "currentInterviewStep": "3" }
Response: { "message": "Candidate stage updated successfully", "data": { "id": 1, "positionId": 1, "candidateId": 1, "applicationDate": "...", "currentInterviewStep": 3, "notes": null, "interviews": [] } }
```

**Verify-then-decide (mandatory pre-step).** Before consuming the endpoints from the frontend:

1. Inspect `backend/src/routes/`, controllers, and services to verify the three endpoints exist with the documented contracts.
2. **If any endpoint is missing or shaped differently**, dispatch `sql-developer` + `frontend-developer` (parallel) to implement it under DDD/Hexagonal:
   - Repository in `backend/src/infrastructure/` (Prisma).
   - Application service in `backend/src/application/services/`.
   - Controller in `backend/src/presentation/controllers/`.
   - Route in `backend/src/routes/`.
   - Zod input schema; standard error shape `{ error, code, message }`.
   - Jest unit tests for service + controller (≥ 80 % branch coverage on the new code).
3. **If endpoints exist**, do not refactor them; only consume.

**Frontend implementation outline.**

- Route: `GET /positions/:id` → lazy-loaded page `PositionPage`.
- Wire the **Ver proceso** button in `Positions.tsx` to `useNavigate()(`/positions/${id}`)`.
- Service module `frontend/src/services/positionService.ts` exporting typed `getInterviewFlow`, `getCandidates`, `updateCandidateStage`.
- Hook `usePositionBoard(id)` that fetches both endpoints in parallel, normalizes candidates by `currentInterviewStep` (number; the foreign-key id, **not** the step name), exposes an optimistic `moveCandidate(applicationId, toStepId)` that calls `updateCandidateStage` and rolls back on error.
- Drag-and-drop via `@dnd-kit/core` + `@dnd-kit/sortable` (keyboard- and screen-reader-friendly). The `DndContext` MUST set `collisionDetection={closestCenter}` and use explicit sensors: a `PointerSensor` with `activationConstraint: { distance: 4 }` (so clicks don't false-trigger drags) and a `KeyboardSensor` with `coordinateGetter: sortableKeyboardCoordinates`. The `onDragEnd` handler MUST resolve the target step id from BOTH possible `over.id` shapes — `column-{stepId}` (empty-column drop) AND `candidate-{appId}-{stepId}` (drop on a sibling card; this is the common case when the target column already has cards). Failing to handle the second case silently discards drops and looks to the user like drag-and-drop is broken. Early-return when `toStepId === fromStepId`. Give `.kanban-column__body` `flex: 1; min-height: ~6rem` so empty columns still have a hit area.
- Components: `PositionPage`, `KanbanBoard`, `KanbanColumn`, `CandidateCard`, `LoadingSkeleton`, `ErrorState`, `Toast`. The back-arrow is rendered inline inside `PositionPage` using `<ChevronLeft>` from `react-bootstrap-icons` — do NOT add a separate `BackButton` Bootstrap `Button` component.
- Mobile breakpoint: stack columns vertically, full-width cards, sticky column header.
- Optimistic UI on stage move; revert with toast on failure.
- LCP candidate is the first kanban column header — apply `fetchpriority="high"` only if it contains an image; otherwise focus on critical CSS.

**Pixel-perfect contract (mandatory — gate G5).** Verified against `docs/position.avif`:

| Element | Requirement |
|---|---|
| Page background | Soft gray (e.g., `#d9d9dc`). Full viewport height. |
| Header | `<ChevronLeft size={28}>` button immediately followed by `<h1>` with text `${positionName} Position` (note the trailing word "Position"). No subtitle line. |
| Column tile | Slightly lighter gray than the page (e.g., `#ececef`), rounded corners (~`0.75rem`), inner padding ~`1rem`. No white card / no shadow. |
| Column header | Step name in a single `<h2>` plus the candidate count in a muted span. |
| Candidate card | White, rounded `~0.5rem`, soft 1-px shadow. Shows the candidate full name on top and a row beneath of **exactly `round(averageScore)` green dots** (color `#009800`, sampled from `docs/position.avif`). Do NOT render 5 placeholder dots with some greyed out — only the filled green ones appear. If `averageScore` rounds to 0, render no row. **No** `App ID:` line. **No** numeric `N/5` badge. |
| Card width | Fixed (~`16rem`) on desktop; full-width on mobile. |
| Mobile (<768px) | Columns stack vertically, full-width. |
| Reduced motion | All card transitions disabled under `prefers-reduced-motion: reduce`. |

**Tests.**

- Cypress E2E: visit `/positions/${Cypress.env('positionId')}` directly (default `positionId = <seeded id>`, configurable via `CYPRESS_positionId=N` or `--env positionId=N`). The list page at `/positions` MUST NOT be used as the entry point — it renders hardcoded mock cards (ids 1–3) that do not exist in the seeded DB, so clicking "Ver proceso" from there lands on a position with no `interviewFlow`. Specs MUST: (a) cross-check the rendered columns and candidate cards against live `GET /positions/:id/interviewFlow` and `GET /positions/:id/candidates`; (b) assert `.score-dot` count per card equals `round(averageScore)`; (c) assert the back button by `aria-label` (no visible text); (d) exercise DnD via `pointerdown` → `pointermove` → `pointerup` on the card and the target column (the events `@dnd-kit`'s `PointerSensor` listens for — native HTML5 `drag` is NOT used) with `cy.intercept('PUT', '/candidates/*/stage').as('moveStage')` and a `cy.wait('@moveStage')` status check; (e) verify the mobile viewport (< 768px) yields `flex-direction: column` on `.kanban-board`.
- Jest backend unit tests: only for endpoints implemented in the verify-then-decide branch.

---

## 14. Architecture & Patterns Guidance

**Backend.** DDD + Hexagonal with ports/adapters. Use a pattern only when the current need justifies it:

- **Repository** — always for Prisma access.
- **Result/Either** — when error paths are part of normal flow.
- **Unit of Work** — only if multi-aggregate transactions are required.
- **CQRS** — only with measurable read/write asymmetry.
- **Factory / Strategy / Observer / Saga / Decorator** — defer until a concrete need appears.

**Frontend.**

- **Custom hooks** — for any non-trivial reusable logic (e.g., `usePositionBoard`).
- **Compound components** — when an API needs composability (e.g., `<Kanban><Kanban.Column>…`).
- **Provider pattern** — for shared state across a subtree; avoid global state until two consumers exist.
- **Render props** — only when neither hooks nor compounds fit.

**Documentation.** JSDoc/TSDoc on every exported symbol — describe params, returns, throws, and any non-obvious invariant.

---

## 15. Security & Tooling Guardrails

- **Sanitize HTML.** DOMPurify on any path that renders user-controlled HTML. Forbid `dangerouslySetInnerHTML` without a sanitizer.
- **Validate inputs.** Zod (preferred) or Valibot at form and API boundaries; share schemas between frontend and backend where possible.
- **Secrets.** Never include API keys, tokens, or credentials in any variable that reaches the bundle. Use `.env` files excluded by `.gitignore`. Add a secret-scan step in CI.
- **Headers.** Configure at the Express layer:
  - `Content-Security-Policy` — strict, allowlist your origins; no `unsafe-inline` unless temporarily justified.
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
  - `X-Frame-Options: DENY`.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Subresource-Integrity` on any external CDN asset.
- **Dependencies.** `npm audit` clean for high+; enable Dependabot on the repo.
- **SAST.** Run `semgrep ci` (default rulesets) and `eslint-plugin-security`. Triage findings via `sast-pentester`.
- **OWASP Top 10.** Walk the diff per release through `owasp-checklist`.
- **Chrome DevTools MCP.** When debugging the frontend, install via the CLI MCP-only flow described at https://github.com/ChromeDevTools/chrome-devtools-mcp/#mcp-client-configuration.

---

## 16. Delivery Artifacts (exact list)

When this prompt finishes executing, the repository must contain:

- `openspec/config.yaml`, `openspec/specs/…`, `openspec/changes/…` (per OpenSpec lifecycle).
- `AGENTS.md` (per §11).
- `CLAUDE.md` (single relative line per §12).
- `.claude/agents/<slug>.md` × 8 (per §6).
- `.claude/skills/<slug>/SKILL.md` (per §7).
- `.claude/commands/<slug>.md` (per §8).
- `scripts/link-ai-tooling.sh` (and `.cmd` shim if Windows is supported); resulting symlinks under `.cursor/`, `.windsurf/`, `.antigravity/`, `.github/copilot/`.
- `frontend/vite.config.ts`, updated `frontend/package.json` scripts, `frontend/index.html` (for Vite), removal of CRA-specific assumptions.
- Position kanban code:
  - `frontend/src/pages/PositionPage.tsx` (lazy-loaded route), `frontend/src/components/Kanban/*`, `frontend/src/hooks/usePositionBoard.ts`, `frontend/src/services/positionService.ts`, `frontend/src/types/position.ts`.
  - Wired `Ver proceso` button in `frontend/src/components/Positions.tsx` and route in `frontend/src/App.{js,tsx}`.
- Backend endpoints (only when verify-then-decide flags them as missing): repository, service, controller, route, Zod schema, Jest tests.
- Cypress setup: `cypress.config.ts` with `env: { positionId: <seeded id> }` (overridable via `CYPRESS_positionId=N` or `--env positionId=N`), **`cypress/support/e2e.ts`** (default supportFile — required to avoid "Your project does not contain a default supportFile" on `cypress run`), `cypress/support/commands.ts`, and `cypress/e2e/position-kanban.cy.ts` that visits `/positions/${Cypress.env('positionId')}` directly per §13.
- Jest backend tests covering **new** code at > 80 %. In this codebase the three kanban endpoints (`GET /positions/:id/interviewFlow`, `GET /positions/:id/candidates`, `PUT /candidates/:id/stage`) already exist with passing tests under `backend/src/{application/services,presentation/controllers}/*.test.ts`, so the verify-then-decide branch (§13) is NOT triggered and no new backend tests are required for the kanban feature itself. If the branch *is* triggered on a future change, add controller + service tests for the new code path and keep coverage above 80% on the diff.
- Seed script (`backend/seed-test-data.ts` or `backend/prisma/seed.ts`) MUST insert at least one `Interview` row per non-screening `Application` with a non-null `score` — otherwise the API will return `averageScore: 0` for every candidate and gate G4 fails. The seed must also create an `Employee` (or reuse an existing one) because `Interview.employeeId` is required.
- **Idempotent backfill** at `backend/scripts/add-interviews.ts` for cases where Applications already exist without Interviews (typical after a partially-failed prior run). It MUST: query `Application.findMany({ include: { interviews: true, position: { include: { interviewFlow: { include: { interviewSteps: true } } } } } })`, skip rows where `interviews.length > 0`, reuse any existing `Recruiter` Employee (creating one only if none exists), and insert one Interview per prior-or-current step with deterministic scores. Run with `npx ts-node --transpile-only scripts/add-interviews.ts` (the project's installed `ts-node` crashes on the standard path with a `resolveTypeReferenceDirective` Debug Failure; `--transpile-only` bypasses it).
- `docs/report.md` (per §18).
- `PR.md` at repo root (per §17).

---

## 17. `PR.md` Template (English Markdown)

```markdown
# LTI Talent Tracking — Agentic Setup & Position Kanban

## Overview
- Purpose, business outcome, and a one-paragraph narrative.

## Stack & Prerequisites
| Layer | Tech | Version |
|---|---|---|
| Frontend | React + TypeScript + Vite + React-Bootstrap | … |
| Backend  | Express + TypeScript + Prisma | … |
| DB       | PostgreSQL (Docker) | 14+ |
| Testing  | Jest, RTL, Cypress | … |
| Tooling  | OpenSpec, Chrome DevTools MCP | … |

Required local setup: Node LTS, Docker, npm, `cp .env.example .env`, `docker compose up -d`.

## Folder & File Reference
| Path | Role |
|---|---|
| `frontend/src/pages/PositionPage.tsx` | Kanban page |
| `frontend/src/components/Kanban/*` | Kanban UI |
| `frontend/src/hooks/usePositionBoard.ts` | Data + optimistic moves |
| `frontend/src/services/positionService.ts` | API client |
| `backend/src/...` | Endpoints (if added) |
| `openspec/` | Specs and changes |
| `.claude/`, `.cursor/`, `.windsurf/`, `.antigravity/` | Agentic toolkit (canonical + symlinks) |
| `AGENTS.md`, `CLAUDE.md` | Codebase analysis & pointer |
| `docs/report.md` | OpenSpec view + run summary |

## Functionality
- Position list → kanban: drag-and-drop stage updates, optimistic UI, mobile vertical layout.
- WCAG 2.2 AA + keyboard DnD via `@dnd-kit/core`.

## Changes Summary
| Area | Change |
|---|---|
| Frontend | CRA → Vite migration; Position kanban; lazy loading; Web Vitals tuning |
| Backend  | Endpoints added/verified for `/positions/:id/interviewFlow`, `/positions/:id/candidates`, `PUT /candidates/:id/stage` |
| Tooling  | OpenSpec, agents/skills/commands, IDE symlinks, Chrome DevTools MCP |
| Quality  | OWASP review, SAST scan, axe-core/Lighthouse a11y, Jest > 80 %, Cypress E2E |

## How to Run
```bash
docker compose up -d
cd backend && npm i && npm run prisma:generate && npm run dev
cd ../frontend && npm i && npm run dev
# E2E
cd ../frontend && npm run cypress:open
# OpenSpec
npx opsx view
```

## Testing Strategy & Results
- Backend Jest coverage: `<pct>%`
- Frontend Cypress: `<pass/fail>`
- Lighthouse a11y: `<score>`
- npm audit: `<high+ findings>`

## Security & Accessibility Audit
- OWASP Top 10 walk-through (link to issues found and fixed)
- SAST findings (semgrep + eslint-plugin-security)
- Headers configured: CSP, HSTS, X-Frame-Options, Referrer-Policy, SRI
- a11y: contrast, keyboard, focus, prefers-reduced-motion

## Conclusions
- What shipped, what was deferred, follow-ups.
```

---

## 18. `docs/report.md` Template (English Markdown)

```markdown
# OpenSpec Run Report

## openspec view
<paste the raw output of `npx opsx view` here>

## Specs
| Spec | Status | Last change |
|---|---|---|
| position-kanban | active / archived | YYYY-MM-DD |

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

---

## 19. Execution Order — Concise Checklist

Run in order; phases tagged `[parallel]` may execute concurrently with their cohort.

1. Bootstrap agentic toolkit: write `.claude/agents/*.md`, `.claude/skills/**/SKILL.md`, `.claude/commands/*.md`, `scripts/link-ai-tooling.sh`. Run script.
2. Phase 1 — OpenSpec install + `openspec/config.yaml`.
3. Phase 2 — Generate `AGENTS.md`.
4. Phase 3 — Write `CLAUDE.md`.
5. Phase 8 — Vite migration (do this before §15 to keep dev server stable).
6. Phase 14 — Chrome DevTools MCP install.
7. Phase 15 — `/opsx:propose` add-position-kanban.
8. Verify-then-decide on backend endpoints (§13). If missing, run Phase 4 (DDD/Hexagonal endpoint implementation) + Phase 5 (JSDoc) `[parallel]` for the backend track.
9. Phase 15 — `/opsx:apply`: implement frontend kanban; Phase 6, 7, 10, 11, 12, 13 `[parallel]` where independent.
10. Phase 9 — Cybersecurity (DOMPurify, Zod, headers, audits) `[parallel]` with Phase 11 a11y audit.
11. Phase 15 — `/opsx:archive`: archive the change; OpenSpec promotes the change's spec delta into `openspec/specs/<capability>/spec.md` (this is what `/opsx:sync` did in older versions; 1.3.x folds sync into archive).
12. Phase 16 — Generate `docs/report.md`.
13. Render `PR.md` via `pr-md-writer`.
14. Re-run `scripts/link-ai-tooling.sh` and assert idempotence (no diff).

---

## 20. Definition of Done

The run is complete when **all** of the following hold:

- [ ] `npm run build` passes for both `frontend/` (Vite) and `backend/`.
- [ ] Jest backend coverage > 80 % on changed code; suite green.
- [ ] Cypress E2E green for the kanban happy path **and** drag-and-drop stage move.
- [ ] Lighthouse a11y ≥ 95 on `/positions` and `/positions/:id`.
- [ ] `npm audit --omit=dev` has no high or critical findings.
- [ ] Symlinks under `.cursor/`, `.windsurf/`, `.antigravity/`, `.github/copilot/` resolve back to `.claude/*` (verify with `readlink -f`).
- [ ] `npx opsx view` runs without warnings.
- [ ] `AGENTS.md`, `CLAUDE.md`, `openspec/config.yaml`, `PR.md`, `docs/report.md` all exist and reflect the actual run.
- [ ] No leftover CRA artifacts (`react-scripts` removed from `frontend/package.json`).
- [ ] No `dangerouslySetInnerHTML` without DOMPurify in the diff.
- [ ] All public exports carry JSDoc/TSDoc.

---

## 21. Failure Modes & Recovery

| Failure | Recovery |
|---|---|
| OpenSpec install fails (network / version) | Fall back to manual scaffold matching §10 contents; record deviation in `PR.md`. |
| `/opsx:*` commands not available in the IDE | Drive the lifecycle manually with the CLI: `openspec init --tools claude --force`, `openspec new change <name>`, edit `proposal.md`/`design.md`/`tasks.md` and `specs/<capability>/spec.md`, `openspec validate <name>`, `openspec archive <name> --yes`. Same artifacts produced. |
| Cypress error: "Your project does not contain a default supportFile" | Create `frontend/cypress/support/e2e.ts` (default supportFile) and `frontend/cypress/support/commands.ts`. Do NOT set `supportFile: false` unless E2E intentionally has no shared setup. |
| Cypress spec navigates via the `/positions` list and lands on a 404-ish kanban with no `interviewFlow` data | The list page renders hardcoded mock cards (ids 1, 2, 3) that do not exist in the seeded DB. The spec MUST visit `/positions/${Cypress.env('positionId')}` directly and read the seeded id from `cypress.config.ts` `env.positionId`. |
| Kanban candidates all show `averageScore: 0` | The seed inserts `Application` rows but no `Interview` rows. Add `Interview` rows with scores (and an `Employee` for `employeeId`) before serving the API. Verify with `curl localhost:3010/positions/<id>/candidates`. |
| `Object.keys(record)` returns strings, breaking strict-mode indexing into `Record<number, …>` | Wrap with `Number(stepId)` when assigning into `Record<number, Candidate[]>`; do not loosen tsconfig. |
| Kanban DnD silently does nothing when a card is dropped on a column that already contains cards | The default `over.id` becomes `candidate-{appId}-{stepId}` (a sibling sortable), not `column-{stepId}`. Update `onDragEnd` to accept both shapes and use `closestCenter` collision detection — see §13 and Gate G8. |
| All kanban cards show 0 / no green dots after the UI renders correctly | Applications exist in the DB but their related Interview rows do not — `averageScore = mean(interviews.score)` returns 0 for an empty `interviews` array. Run `backend/scripts/add-interviews.ts` to backfill (idempotent). See Gate G9. |
| `ts-node` crashes with `Debug Failure. False expression: Non-string value passed to ts.resolveTypeReferenceDirective` | This repo's pinned `ts-node` + `typescript` combination has a known resolver mismatch. Re-run with `npx ts-node --transpile-only <file>`. Do not upgrade `typescript` globally unless the project pin allows it. |
| Backend endpoints missing | Trigger the verify-then-decide branch (§13); finish backend track before frontend consumes endpoints. |
| `@dnd-kit/core` keyboard support insufficient | Add explicit ARIA live region announcements for stage changes; document in `PR.md`. |
| Symlinks unsupported (Windows w/o admin) | Provide `scripts/link-ai-tooling.cmd` using `mklink /D`; if disallowed, copy files and document the deviation. |
| Lighthouse a11y < 95 | Iterate via `a11y-audit` until met; common fixes: focus rings, color contrast, label associations. |
| `npm audit` high+ findings unresolvable | Pin and patch via overrides; document remaining risk in `PR.md` Security section. |
| CSP breaks third-party assets | Tighten allowlist incrementally; never disable CSP. |

---

> **Run this prompt** by executing the phases in §19 with the agents in §6, dispatched via the commands in §8. Maintain atomicity, parallelize independent work, and write `PR.md` + `docs/report.md` as the final step.
