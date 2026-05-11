# AGENTS.md — LTI Talent Tracking System Codebase Reference

## 1. Business Purpose

The **LTI Talent Tracking System** is a recruitment management platform that helps HR teams and hiring managers track candidates through interview pipelines. The system supports:

- **HR/Recruiters**: View open positions, manage candidates, track interview progress
- **Hiring Managers**: Review candidates in each interview stage, provide feedback
- **Candidates**: Submit applications, track their position in the process

Core feature: **Position Kanban** — visualize and move candidates through interview stages via drag-and-drop.

---

## 2. Folder Map

```
repo-root/
├── frontend/                          # React 18 + TypeScript, Vite (migrated from CRA)
│   ├── public/                        # Static assets (will move to Vite's public/ under root)
│   ├── src/
│   │   ├── components/                # React components (Positions.tsx, Kanban, etc.)
│   │   ├── services/                  # API client modules (positionService.ts, candidateService.js)
│   │   ├── hooks/                     # Custom React hooks (usePositionBoard.ts) [NEW]
│   │   ├── types/                     # TypeScript interfaces (position.ts) [NEW]
│   │   ├── pages/                     # Page components (PositionPage.tsx) [NEW]
│   │   ├── App.js                     # Router (real app; App.tsx is a CRA stub to be deleted)
│   │   ├── index.tsx                  # React root
│   │   └── index.css                  # Global styles
│   ├── package.json                   # Dependencies (react-bootstrap, react-router-dom, etc.)
│   ├── tsconfig.json                  # TypeScript config
│   └── vite.config.ts                 # Vite build config [NEW]
│
├── backend/                           # Express 4 + TypeScript, Prisma 5
│   ├── src/
│   │   ├── domain/models/             # DDD domain entities (Position.ts, Candidate.ts, etc.)
│   │   ├── infrastructure/            # Persistence layer (Prisma repositories) [EXPANDED]
│   │   ├── application/services/      # Business logic (positionService.ts, candidateService.ts)
│   │   ├── presentation/controllers/  # Express request/response handlers
│   │   ├── routes/                    # Express route definitions (positionRoutes.ts, candidateRoutes.ts)
│   │   └── index.ts                   # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma              # PostgreSQL schema (entities, relations)
│   │   └── migrations/                # Prisma migrations
│   ├── package.json                   # Backend dependencies (express, @prisma/client, jest)
│   └── jest.config.js                 # Jest test config
│
├── openspec/                          # Specification-driven development
│   ├── config.yaml                    # OpenSpec project config
│   ├── specs/                         # Approved, synced specifications
│   ├── changes/                       # Proposed changes in development
│   └── archive/                       # Completed feature specs
│
├── docs/                              # Reference assets and reports
│   ├── positions.avif                 # Design reference: Positions list page
│   ├── position.avif                  # Design reference: Position detail (kanban)
│   ├── report.md                      # OpenSpec run report [NEW]
│   └── ...
│
├── scripts/
│   ├── link-ai-tooling.sh             # IDE symlink setup (macOS/Linux)
│   └── link-ai-tooling.cmd            # IDE symlink setup (Windows)
│
├── .claude/                           # Claude Code agentic toolkit (canonical)
│   ├── agents/                        # 8 specialist agents
│   │   ├── openspec-analyst.md
│   │   ├── graphic-designer.md
│   │   ├── frontend-developer.md
│   │   ├── owasp-security.md
│   │   ├── sast-pentester.md
│   │   ├── devops.md
│   │   ├── sql-developer.md
│   │   └── tester.md
│   ├── skills/                        # 19 atomic checklists
│   │   ├── openspec-init/SKILL.md
│   │   ├── vite-migrate/SKILL.md
│   │   ├── web-vitals-audit/SKILL.md
│   │   ├── a11y-audit/SKILL.md
│   │   ├── owasp-checklist/SKILL.md
│   │   ├── sast-scan/SKILL.md
│   │   ├── dompurify-zod-guard/SKILL.md
│   │   ├── dnd-kanban/SKILL.md
│   │   ├── jsdoc-public-api/SKILL.md
│   │   ├── cypress-e2e-bootstrap/SKILL.md
│   │   ├── jest-backend-bootstrap/SKILL.md
│   │   ├── prisma-endpoint/SKILL.md
│   │   ├── chrome-devtools-mcp-setup/SKILL.md
│   │   ├── pr-md-writer/SKILL.md
│   │   └── report-md-writer/SKILL.md
│   └── commands/                      # slash entry points
│       ├── opsx/                       # OpenSpec-installed (canonical /opsx:*)
│       │   ├── propose.md
│       │   ├── apply.md
│       │   ├── archive.md
│       │   └── explore.md
│       ├── audit-web-vitals.md
│       ├── audit-a11y.md
│       ├── audit-owasp.md
│       ├── scan-sast.md
│       ├── setup-chrome-devtools-mcp.md
│       └── build-position-kanban.md
│
├── .cursor/, .windsurf/, .antigravity/, .github/copilot/
│   └── agents/ + commands/            # Symlinks to .claude/ (IDE-agnostic)
│
├── AGENTS.md                          # This file (codebase reference)
├── CLAUDE.md                          # Pointer to AGENTS.md [NEW]
├── PR.md                              # Pull request summary [NEW]
├── docker-compose.yml                 # PostgreSQL + Redis services
├── README.md                          # Project setup instructions
└── .gitignore                         # Git exclusions (.env, node_modules, etc.)
```

---

## 3. Design Tokens

### Bootstrap 5.3 Variables (React-Bootstrap)

The project uses **Bootstrap 5.3** via `react-bootstrap` package. Key design tokens are defined in Bootstrap CSS custom properties:

**Colors:**
- Primary: `#0d6efd` (blue)
- Success: `#198754` (green) — used for "Contratado" status badge
- Warning: `#ffc107` (yellow) — used for "Abierto" status badge
- Secondary: `#6c757d` (gray) — used for "Borrador" status badge
- Danger: `#dc3545` (red)
- Dark: `#212529`

**Spacing:**
- Gaps: `0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, etc. (Bootstrap spacing scale)
- Used via `className="mb-4"` (margin-bottom), `className="mt-3"` (margin-top), etc.

**Typography:**
- Font family: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...` (Bootstrap default)
- Font sizes: `0.875rem` (small), `1rem` (base), `1.25rem` (h5), `1.5rem` (h4), `1.75rem` (h3), etc.

**Breakpoints (Bootstrap):**
- `xs`: 0px
- `sm`: 576px
- `md`: 768px
- `lg`: 992px
- `xl`: 1200px
- `xxl`: 1400px

Mobile-first: use `className="col-md-4"` (full width on mobile, 1/3 on md+).

**Custom CSS variables:**
- None defined yet; use Bootstrap defaults.

---

## 4. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Frontend** | React | 18.3.1 | Component library; hooks for state |
| | TypeScript | 4.9.5 | Type safety; compiled to ES2022 |
| | Vite | latest | Build tool (replaces CRA) |
| | React-Bootstrap | 2.10.2 | Bootstrap 5 components |
| | React Router | 6.23.1 | Client-side routing |
| | react-bootstrap-icons | 1.11.4 | Icon library |
| | axios | (missing, will add) | HTTP client |
| | dnd-kit | (to add) | Accessible drag-and-drop |
| | dompurify | (to add) | HTML sanitization |
| | zod | (to add) | Input validation schemas |
| **Backend** | Express | 4.19.2 | HTTP server |
| | TypeScript | 4.9.5 | Type-safe server code |
| | Prisma | 5.13.0 | ORM for PostgreSQL |
| | Jest | 29.x | Unit testing |
| | ts-jest | latest | TypeScript + Jest integration |
| **Database** | PostgreSQL | 14+ | Relational DB (Docker) |
| **Testing** | Cypress | (to add) | E2E testing |
| | React Testing Library | 13.4.0 | Component unit tests |
| **Node.js** | LTS | 18+ | Runtime |

---

## 5. Frontend Architecture

### Directory Structure
```
frontend/src/
├── components/
│   ├── Positions.tsx                  # Positions list (entry point, "Ver proceso" button)
│   ├── Kanban/                        # Kanban sub-components [NEW]
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── CandidateCard.tsx
│   │   ├── BackButton.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── ErrorState.tsx
│   │   └── Toast.tsx
│   ├── AddCandidateForm.js
│   ├── FileUploader.js
│   └── RecruiterDashboard.js
├── services/
│   ├── positionService.ts             # GET /positions/:id/interviewFlow, etc. [NEW]
│   └── candidateService.js            # GET /candidates/:id, POST /candidates/, etc.
├── hooks/
│   └── usePositionBoard.ts            # Loads kanban data, manages optimistic moves [NEW]
├── types/
│   └── position.ts                    # TypeScript interfaces [NEW]
├── pages/
│   └── PositionPage.tsx               # /positions/:id lazy-loaded page [NEW]
├── App.js                             # Router (BrowserRouter, Routes, Route)
├── index.tsx                          # React root + CSS imports
└── index.css                          # Global styles
```

### State Management

**Current:** React hooks + Context (minimal)
- **Positions.tsx**: Mock data (no state fetch)
- **AddCandidateForm.js**: Local state (form fields)
- **PositionPage.tsx**: Custom hook `usePositionBoard()` returns `{ board, loading, error, moveCandidate }`

**Routing:**
- Entry: `App.js` with `<BrowserRouter>` and `<Routes>`
- Routes:
  - `/` → RecruiterDashboard
  - `/positions` → Positions list
  - `/positions/:id` → PositionPage (lazy-loaded)
  - `/add-candidate` → AddCandidateForm

**Lazy Loading:**
- `React.lazy()` on PositionPage to code-split the kanban feature
- Image optimization: `loading="lazy"` on non-critical images; `fetchpriority="high"` on LCP image

### API Contract

**Services** (`frontend/src/services/positionService.ts`):
```ts
export const getInterviewFlow = async (positionId: number) => {...}
export const getCandidates = async (positionId: number) => {...}
export const updateCandidateStage = async (applicationId: number, stepId: number) => {...}
```

**Hook** (`frontend/src/hooks/usePositionBoard.ts`):
```ts
export const usePositionBoard = (positionId: number) => {
  return {
    board: { columns: [...], candidates: [...] },
    loading: boolean,
    error: Error | null,
    moveCandidate: (applicationId: number, toStepId: number) => Promise<void>
  }
}
```

**Validation:**
- Zod schemas on form inputs before API call
- Service methods validate request params

---

## 6. Backend Architecture

### DDD/Hexagonal Layers

```
Backend Stack (DDD/Hexagonal)

┌─────────────────────────────────────────────────┐
│ Presentation Layer (Controllers)                │
│ ├─ positionController.ts                        │
│ └─ candidateController.ts                       │
│ → Express request/response mapping              │
└──────────────────┬──────────────────────────────┘
                   ↓ (uses services)
┌─────────────────────────────────────────────────┐
│ Application Layer (Services)                    │
│ ├─ positionService.ts                           │
│ └─ candidateService.ts                          │
│ → Business logic, service orchestration         │
└──────────────────┬──────────────────────────────┘
                   ↓ (uses repositories)
┌─────────────────────────────────────────────────┐
│ Infrastructure Layer (Repositories)             │
│ ├─ PositionRepository                           │
│ ├─ CandidateRepository                          │
│ └─ ApplicationRepository                        │
│ → Prisma queries, persistence                   │
└──────────────────┬──────────────────────────────┘
                   ↓ (uses ORM)
┌─────────────────────────────────────────────────┐
│ Domain Layer (Models)                           │
│ ├─ Position.ts (pure domain entity)             │
│ ├─ Candidate.ts                                 │
│ ├─ Application.ts                               │
│ └─ ...                                          │
│ → No framework code, business rules             │
└─────────────────────────────────────────────────┘
```

### Routes and Endpoints

**Positions** (`backend/src/routes/positionRoutes.ts`):
- `GET /positions/:id/interviewFlow` → returns `{ positionName, interviewFlow: { id, description, interviewSteps[] } }`
- `GET /positions/:id/candidates` → returns `[{ fullName, currentInterviewStep, averageScore, applicationId }]`

**Candidates** (`backend/src/routes/candidateRoutes.ts`):
- `POST /candidates/` → add candidate
- `GET /candidates/:id` → get by id
- `PUT /candidates/:id/stage` → update stage (body: `{ applicationId, currentInterviewStep }`)

**Middleware:**
- CORS enabled
- Multer for file uploads
- Swagger/OpenAPI docs registered

### Prisma Schema Highlights

Key models and relations:

```
Position
├─ id (PK)
├─ title, description, status
├─ company (FK → Company)
├─ interviewFlow (FK → InterviewFlow)
└─ applications (1:N → Application)

InterviewFlow
├─ id (PK)
├─ description
└─ interviewSteps (1:N → InterviewStep)

InterviewStep
├─ id (PK)
├─ interviewFlowId (FK)
├─ interviewTypeId (FK)
├─ name, orderIndex
└─ applications (1:N → Application) [via currentInterviewStep]

Application
├─ id (PK)
├─ positionId (FK)
├─ candidateId (FK)
├─ currentInterviewStep (FK → InterviewStep)
├─ interviews (1:N → Interview)
└─ notes, applicationDate

Candidate
├─ id (PK)
├─ fullName, email, phoneNumber
├─ educations (1:N → Education)
├─ workExperiences (1:N → WorkExperience)
├─ resume (1:1 → Resume)
└─ applications (1:N → Application)

Interview
├─ id (PK)
├─ applicationId (FK)
├─ interviewTypeId (FK)
├─ score, feedback, interviewDate
```

### Error Handling

**Standard error response shape:**
```ts
{
  error: string,
  code: string,      // e.g., "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR"
  message: string
}
```

Controllers catch errors and return appropriate HTTP status + error shape.

---

## 7. Data Model Summary

**Core Entities:**
1. **Position** — open job requisition (title, description, status, deadline, company, interview flow)
2. **Candidate** — person applying (name, email, resume, education, work history)
3. **Application** — candidate's progress through a position's interview flow (current stage, notes, interview history)
4. **Interview** — individual interview feedback (type, score, date, feedback)
5. **InterviewFlow** — pipeline definition (set of interview steps in order)
6. **InterviewStep** — stage in a pipeline (name, type, order index)
7. **InterviewType** — type of interview (phone screen, technical, behavioral, etc.)
8. **Company** — employer (name, industry, etc.)

**Key Relations:**
- 1 Position → 1 InterviewFlow (defines the interview pipeline)
- 1 InterviewFlow → N InterviewSteps (ordered stages)
- 1 Position → N Applications (multiple candidates per position)
- 1 Application → 1 Candidate (one candidate per application)
- 1 Application → 1 CurrentInterviewStep (candidate's current stage)
- 1 Application → N Interviews (feedback for each stage)

---

## 8. Testing Strategy

### Backend (Jest + ts-jest)

**Unit Tests:**
- Service layer: `positionService.test.ts`, `candidateService.test.ts`
- Controller layer: `positionController.test.ts`, `candidateController.test.ts`
- Mock Prisma client; test business logic in isolation

**Integration Tests:**
- Route handlers with real (test) database
- Verify API contracts (status, response shape)

**Coverage:**
- Target: > 80% for new code (branches, functions, lines, statements)
- `jest.config.js` defines threshold; CI fails if below

**Commands:**
- `npm test` → run all tests
- `npm test -- --coverage` → generate coverage report
- `npm test -- --watch` → re-run on file changes

### Frontend (Cypress + React Testing Library)

**E2E Tests** (Cypress):
- Scenario: `/positions` → click "Ver proceso" → kanban renders → drag candidate → API call fires → reload shows new position
- Mobile viewport test: columns stack vertically on 320px width
- Fixtures: mock data for `interviewFlow`, `candidates`

**Unit Tests** (React Testing Library):
- Component tests (render, user interactions)
- Hook tests (usePositionBoard behavior)

**Lighthouse Audits:**
- Performance: Vite bundle size, LCP/INP/CLS metrics
- Accessibility: WCAG 2.2 AA compliance, axe-core
- SEO: (basic, not critical)

**Commands:**
- `npm run dev` → start dev server (Vite, port 3000)
- `npm run build` → Vite production build
- `npx cypress open` → interactive Cypress UI
- `npx cypress run` → headless Cypress run

---

## 9. Operational Notes

### Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: lti_talent_tracking
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Optional: Redis for caching (not currently used)
  # redis:
  #   image: redis:7
  #   ports:
  #     - "6379:6379"
```

**Usage:**
```bash
docker compose up -d          # Start services in background
docker compose down           # Stop services
docker compose logs postgres  # View logs
```

### Environment Variables

**Backend** (`.env`):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lti_talent_tracking"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
PORT=3010
```

**Frontend** (`.env` if needed, Vite handles via import.meta.env):
```
VITE_API_BASE_URL="http://localhost:3010"
```

### Ports

- **Frontend Dev Server**: `http://localhost:3000` (Vite)
- **Backend API**: `http://localhost:3010` (Express)
- **PostgreSQL**: `localhost:5432`
- **Swagger API Docs**: `http://localhost:3010/api-docs` (if configured)

### Database Migrations

```bash
# Generate Prisma types from schema
npm run prisma:generate

# Create migration file (after schema.prisma change)
npm run prisma:migrate:dev --name "add_position_kanban"

# Apply migrations in prod
npm run prisma:migrate:deploy

# View/seed database
npm run prisma:studio  # Prisma Studio (GUI)
npm run seed           # Run seed script (if exists)
```

### CI/CD Integration

- **GitHub Actions** (CI gates):
  - `npm run build` (both frontend and backend)
  - `npm test` (Jest, backend coverage > 80%)
  - `npm audit` (security scan)
  - `npx cypress run` (E2E tests, if running)
  - Optional: `semgrep ci` (SAST scan)

- **Dependabot**: Auto-upgrade dependencies (with PR review)

### IDE Tools

- **Chrome DevTools MCP**: Debug live browser state, measure performance, inspect DOM
- **Vite HMR**: Hot module replacement during frontend dev
- **Prisma Studio**: Visual database editor

---

## Summary

The LTI Talent Tracking System is a full-stack React + Express application with a modern, spec-driven development workflow. Frontend uses React-Bootstrap for UI consistency; backend applies DDD/Hexagonal patterns for maintainability. Testing and security are integrated into the development process via Jest, Cypress, OWASP reviews, and SAST scanning. The agentic toolkit (8 agents, 19 skills, 10 commands) automates the specification, implementation, and verification of new features.
