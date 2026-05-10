import React from 'react';
import { Card } from 'react-bootstrap';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Candidate, InterviewStep } from '../../types/position';
import CandidateCard from './CandidateCard';

interface KanbanColumnProps {
  step: InterviewStep;
  candidates: Candidate[];
}

/**
 * Kanban column representing an interview step.
 * Displays candidates as draggable cards within the column.
 * Handles drop zones for drag-and-drop updates.
 */
const KanbanColumn: React.FC<KanbanColumnProps> = ({ step, candidates }) => {
  const { setNodeRef } = useDroppable({
    id: `column-${step.id}`,
  });

  return (
    <Card className="kanban-column h-100">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">{step.name}</h5>
          <small className="text-muted">{candidates.length} candidate(s)</small>
        </div>
      </Card.Header>
      <Card.Body className="p-2" ref={setNodeRef}>
        <SortableContext
          items={candidates.map((c) => `candidate-${c.applicationId}-${step.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="d-flex flex-column gap-2">
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.applicationId}
                  candidate={candidate}
                  stepId={step.id}
                />
              ))
            ) : (
              <div className="text-muted text-center py-4">
                <p>No candidates</p>
              </div>
            )}
          </div>
        </SortableContext>
      </Card.Body>
    </Card>
  );
};

export default KanbanColumn;
