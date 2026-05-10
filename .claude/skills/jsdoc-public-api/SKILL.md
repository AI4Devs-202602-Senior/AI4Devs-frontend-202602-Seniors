---
name: jsdoc-public-api
description: Add JSDoc/TSDoc to every exported function/class/hook.
allowed-tools: [Read, Edit]
---

# jsdoc-public-api Skill

## Checklist

Frontend and Backend:

- [ ] Identify all public exports in `src/` (not `_private.ts`)
- [ ] For each exported function:
  ```ts
  /**
   * Fetches the interview flow and candidates for a given position.
   * @param positionId - The position ID
   * @returns Promise resolving to the kanban board data
   * @throws Error if position not found
   */
  export const getPositionBoard = async (positionId: number) => { ... }
  ```
- [ ] For each exported hook:
  ```ts
  /**
   * Loads position kanban board data and manages stage moves.
   * @param positionId - The position to load
   * @returns Object with board data, loading state, error, and moveCandidate function
   */
  export const usePositionBoard = (positionId: number) => { ... }
  ```
- [ ] For each exported class/interface:
  ```ts
  /**
   * Represents a candidate card in the kanban board.
   * @property fullName - Candidate's full name
   * @property averageScore - Interview score (0-5)
   * @property currentInterviewStep - Step ID candidate is in
   */
  export interface Candidate { ... }
  ```
- [ ] Grep for exports; ensure all have docs: `grep -E "^export (const|function|class|interface)" src/**/*.ts`

## Success Criteria

- Every exported symbol has JSDoc/TSDoc
- Docs include params, return type, throws clause if applicable
- No TODOs in docstrings (doc is complete)
