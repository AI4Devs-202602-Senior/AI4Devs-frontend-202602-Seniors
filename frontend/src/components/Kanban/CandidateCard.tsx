import React from 'react';
import { Card } from 'react-bootstrap';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '../../types/position';

interface CandidateCardProps {
  candidate: Candidate;
  stepId: number;
}

const MAX_SCORE = 5;

/**
 * Draggable candidate card for the kanban board.
 * Renders the candidate's full name and their average score as
 * N green circles (one per integer point of `averageScore`), matching
 * docs/position.avif — no unfilled placeholder dots.
 */
const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, stepId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `candidate-${candidate.applicationId}-${stepId}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const score = Math.max(0, Math.min(MAX_SCORE, Math.round(candidate.averageScore)));

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="candidate-card"
      {...attributes}
      {...listeners}
    >
      <Card.Body className="candidate-card__body">
        <h6 className="candidate-card__name">{candidate.fullName}</h6>
        {score > 0 && (
          <div
            className="candidate-card__score"
            role="img"
            aria-label={`Average score ${score} out of ${MAX_SCORE}`}
          >
            {Array.from({ length: score }).map((_, i) => (
              <span key={i} className="score-dot" aria-hidden="true" />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CandidateCard;
