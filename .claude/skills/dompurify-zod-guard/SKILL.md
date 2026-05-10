---
name: dompurify-zod-guard
description: Add DOMPurify for HTML rendering; add Zod schemas at form/API boundaries.
allowed-tools: [Read, Write, Edit]
---

# dompurify-zod-guard Skill

## Checklist

### Frontend

- [ ] Install: `npm install dompurify` and `npm install --save-dev @types/dompurify`
- [ ] Identify all `dangerouslySetInnerHTML` in codebase
- [ ] For each instance:
  - [ ] Wrap content with `DOMPurify.sanitize()`: `dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }}`
  - [ ] Add JSDoc comment: `// Sanitized with DOMPurify to prevent XSS`
- [ ] Install Zod: `npm install zod`
- [ ] For each form in `frontend/src/`:
  - [ ] Create a Zod schema (e.g., `SearchPositionsSchema`, `UpdateCandidateSchema`)
  - [ ] Use `schema.parse(data)` or `schema.safeParse(data)` before sending to API
- [ ] For each API service in `frontend/src/services/`:
  - [ ] Add input validation: `const validated = positionSchema.parse(params)`
  - [ ] Return typed response (using `z.infer<typeof schema>`)

### Backend

- [ ] Install Zod: `npm install zod`
- [ ] For each Express route handler:
  - [ ] Define input Zod schema for `req.body`, `req.params`, `req.query`
  - [ ] Validate at handler entry: `const { positionId } = ParamSchema.parse(req.params)`
  - [ ] Return standard error shape on validation failure: `{ error: "Invalid input", code: "VALIDATION_ERROR", message: "positionId must be a number" }`

## Success Criteria

- No `dangerouslySetInnerHTML` without DOMPurify
- All form inputs validated with Zod before server call
- All backend endpoints validate inputs with Zod
- Standard error response shape used consistently
