---
name: jest-backend-bootstrap
description: Ensure Jest + ts-jest config; add coverage threshold; write tests for new endpoints.
allowed-tools: [Read, Write, Edit, Bash]
---

# jest-backend-bootstrap Skill

## Checklist

Backend directory: `backend/`

- [ ] Verify Jest + ts-jest installed: `npm ls jest ts-jest`
- [ ] Create or verify `jest.config.js`:
  ```js
  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
    coverageThreshold: { global: { branches: 80, functions: 80, lines: 80, statements: 80 } }
  }
  ```
- [ ] For new backend endpoint, write tests in `src/application/services/{service}.test.ts`:
  - [ ] Test service happy path (valid input → correct output)
  - [ ] Test error handling (invalid input → throws or returns error)
  - [ ] Test edge cases (empty result, multiple results, boundary values)
- [ ] Write controller tests in `src/presentation/controllers/{controller}.test.ts`:
  - [ ] Test 200 response (valid input)
  - [ ] Test 400 response (bad request / validation error)
  - [ ] Test 404 response (resource not found)
- [ ] Mock Prisma client in tests: use `jest.mock('@prisma/client')`
- [ ] Run tests: `npm test -- --coverage`
- [ ] Verify coverage report shows ≥ 80% for changed code
- [ ] Commit: `git add . && git commit -m "test: add unit tests for {endpoint}"`

## Success Criteria

- `npm test -- --coverage` runs green
- Coverage threshold ≥ 80% for new code
- Tests are isolated (use mocks, not real DB)
- Service + controller tests both present
