import React from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanBoard as KanbanBoardType } from '../../types/position';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  board: KanbanBoardType;
  onMoveCandidate: (
    applicationId: number,
    fromStepId: number,
    toStepId: number
  ) => Promise<void>;
}

/**
 * Resolves the target step id from a drop event.
 * Drops may land on a column droppable (id "column-{stepId}") or, when the
 * column already contains candidates, on a sibling candidate sortable
 * (id "candidate-{applicationId}-{stepId}"). Both encode the step id.
 */
const targetStepId = (overId: string): number | null => {
  const parts = overId.split('-');
  if (parts[0] === 'column') return Number(parts[1]);
  if (parts[0] === 'candidate') return Number(parts[2]);
  return null;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ board, onMoveCandidate }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeParts = String(active.id).split('-');
    if (activeParts[0] !== 'candidate') return;

    const applicationId = Number(activeParts[1]);
    const fromStepId = Number(activeParts[2]);
    const toStepId = targetStepId(String(over.id));

    if (
      toStepId === null ||
      Number.isNaN(applicationId) ||
      Number.isNaN(fromStepId) ||
      Number.isNaN(toStepId) ||
      toStepId === fromStepId
    ) {
      return;
    }

    onMoveCandidate(applicationId, fromStepId, toStepId);
  };

  const sortedSteps = Object.values(board.columns).sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {sortedSteps.map((step) => (
          <div key={step.id} className="kanban-column-wrapper">
            <KanbanColumn
              step={step}
              candidates={board.candidates[step.id] || []}
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
