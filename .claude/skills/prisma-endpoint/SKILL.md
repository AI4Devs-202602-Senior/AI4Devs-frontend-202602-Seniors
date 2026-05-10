---
name: prisma-endpoint
description: Add Express + Prisma endpoint under DDD/Hexagonal with repository + service + controller + Jest.
allowed-tools: [Read, Write, Edit, Bash]
---

# prisma-endpoint Skill

## Checklist

Backend directory: `backend/`

**DDD/Hexagonal layers:**
1. **Domain** (`src/domain/models/`) — pure business logic (no framework, no persistence)
2. **Infrastructure** (`src/infrastructure/repositories/`) — Prisma queries
3. **Application** (`src/application/services/`) — orchestrates repositories, business rules
4. **Presentation** (`src/presentation/controllers/`) — Express handlers, request/response mapping
5. **Routes** (`src/routes/`) — Express route definitions

**For a new endpoint (e.g., `PUT /positions/:id/stage`):**

- [ ] If needed: update `backend/prisma/schema.prisma`, generate migration: `npm run prisma:generate`
- [ ] Create repository in `backend/src/infrastructure/repositories/ApplicationRepository.ts`:
  ```ts
  export class ApplicationRepository {
    static async updateStage(applicationId: number, stepId: number) { ... }
  }
  ```
- [ ] Create service in `backend/src/application/services/positionService.ts`:
  ```ts
  export const updateCandidateStage = async (applicationId, stepId) => {
    const updated = await ApplicationRepository.updateStage(...)
    return updated
  }
  ```
- [ ] Create controller in `backend/src/presentation/controllers/positionController.ts`:
  ```ts
  export const updateCandidateStageController = async (req, res) => {
    const { applicationId, currentInterviewStep } = StageUpdateSchema.parse(req.body)
    const result = await updateCandidateStage(applicationId, currentInterviewStep)
    res.json({ message: "...", data: result })
  }
  ```
- [ ] Add route in `backend/src/routes/candidateRoutes.ts`:
  ```ts
  router.put('/:id/stage', updateCandidateStageController)
  ```
- [ ] Add Zod schema for input validation
- [ ] Write Jest tests for controller + service (≥ 80% coverage)
- [ ] Test: `curl -X PUT http://localhost:3010/candidates/1/stage -d '...'`

## Success Criteria

- All 5 DDD layers present and connected
- Endpoint returns correct response shape
- Input validation with Zod passes
- Jest tests cover happy path + error cases
- Coverage ≥ 80% for new code
