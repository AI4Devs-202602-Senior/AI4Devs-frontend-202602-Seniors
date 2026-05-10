import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
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
 * Main kanban board component with drag-and-drop support.
 * Renders columns for each interview step and candidate cards.
 * Uses @dnd-kit for accessible drag-and-drop.
 */
const KanbanBoard: React.FC<KanbanBoardProps> = ({
  board,
  onMoveCandidate,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Parse drag data: format is "candidate-{applicationId}-{fromStepId}"
    const activeData = String(active.id).split('-');
    const overData = String(over.id).split('-');

    if (activeData[0] !== 'candidate' || overData[0] !== 'column') return;

    const applicationId = parseInt(activeData[1], 10);
    const fromStepId = parseInt(activeData[2], 10);
    const toStepId = parseInt(overData[1], 10);

    if (!isNaN(applicationId) && !isNaN(fromStepId) && !isNaN(toStepId)) {
      onMoveCandidate(applicationId, fromStepId, toStepId);
    }
  };

  const sortedSteps = Object.values(board.columns).sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Row className="kanban-board g-3">
        {sortedSteps.map((step) => (
          <Col key={step.id} xs={12} sm={6} lg={4} className="kanban-column-wrapper">
            <KanbanColumn
              step={step}
              candidates={board.candidates[step.id] || []}
            />
          </Col>
        ))}
      </Row>
    </DndContext>
  );
};

export default KanbanBoard;
