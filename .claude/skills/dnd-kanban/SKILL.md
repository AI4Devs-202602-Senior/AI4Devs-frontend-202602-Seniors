---
name: dnd-kanban
description: Implement drag-and-drop kanban with @dnd-kit/core (a11y- and mobile-friendly).
allowed-tools: [Read, Write, Edit, Bash]
---

# dnd-kanban Skill

## Checklist

Frontend directory: `frontend/`

- [ ] Install: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [ ] Import in `PositionPage.tsx` or `KanbanBoard.tsx`:
  ```ts
  import { DndContext, DragEndEvent } from '@dnd-kit/core'
  import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
  import { useSortable } from '@dnd-kit/sortable'
  ```
- [ ] Build `KanbanBoard` wrapper with `DndContext`
- [ ] Build `KanbanColumn` using `SortableContext` + `useSortable` for drag zones
- [ ] Build `CandidateCard` with `useSortable` for individual draggable items
- [ ] On drag end: dispatch optimistic move (`moveCandidate`) → call `PUT /candidates/:id/stage`
- [ ] Rollback move on API error + show error toast
- [ ] Keyboard support: @dnd-kit handles Tab/Space/Enter for keyboard drag (no extra work needed)
- [ ] Mobile support: @dnd-kit auto-detects touch; no additional config needed
- [ ] Test: drag card from column A → column B; optimistic UI updates; API call fires; reload renders in new column

## Success Criteria

- Drag-and-drop works with mouse on desktop
- Keyboard navigation (Tab + Space/Enter) works
- Mobile touch drag works
- Optimistic move happens immediately; reverts on API error
- No console warnings from @dnd-kit
