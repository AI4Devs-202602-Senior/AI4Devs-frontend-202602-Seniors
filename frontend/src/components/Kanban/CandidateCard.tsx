import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '../../types/position';

interface CandidateCardProps {
  candidate: Candidate;
  stepId: number;
}

/**
 * Draggable candidate card within a kanban column.
 * Shows candidate name and average score.
 * Supports keyboard and mouse drag-and-drop.
 */
const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  stepId,
}) => {
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const scoreColor = candidate.averageScore >= 4 ? 'success' : 'warning';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="candidate-card cursor-grab"
      {...attributes}
      {...listeners}
    >
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6 className="mb-1">{candidate.fullName}</h6>
            <small className="text-muted">App ID: {candidate.applicationId}</small>
          </div>
          <Badge bg={scoreColor} className="ms-2">
            {candidate.averageScore}/5
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CandidateCard;
