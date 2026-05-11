import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Candidate, InterviewStep } from '../../types/position';
import CandidateCard from './CandidateCard';

interface KanbanColumnProps {
  step: InterviewStep;
  candidates: Candidate[];
}

/**
 * Kanban column representing a single interview step.
 * Provides a drop zone for candidate cards and exposes the
 * step's candidates as a sortable context for keyboard DnD.
 */
const KanbanColumn: React.FC<KanbanColumnProps> = ({ step, candidates }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${step.id}` });

  return (
    <section
      className={`kanban-column${isOver ? ' kanban-column--drop' : ''}`}
      aria-label={`${step.name} column`}
    >
      <header className="kanban-column__header">
        <h2 className="kanban-column__title">{step.name}</h2>
        <span className="kanban-column__count" aria-hidden="true">
          {candidates.length}
        </span>
      </header>
      <div className="kanban-column__body" ref={setNodeRef}>
        <SortableContext
          items={candidates.map((c) => `candidate-${c.applicationId}-${step.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <CandidateCard
                key={candidate.applicationId}
                candidate={candidate}
                stepId={step.id}
              />
            ))
          ) : (
            <p className="kanban-column__empty">No candidates</p>
          )}
        </SortableContext>
      </div>
    </section>
  );
};

export default KanbanColumn;
