import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { usePositionBoard } from '../hooks/usePositionBoard';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import LoadingSkeleton from '../components/Kanban/LoadingSkeleton';
import ErrorState from '../components/Kanban/ErrorState';
import Toast from '../components/Kanban/Toast';
import '../styles/PositionPage.css';

/**
 * Position detail page with kanban board for managing candidates through interview stages.
 * Lazy-loaded route for code splitting.
 */
const PositionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const positionId = parseInt(id || '0', 10);

  const { board, loading, error, positionName, moveCandidate } =
    usePositionBoard(positionId);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleMoveCandidate = async (
    applicationId: number,
    fromStepId: number,
    toStepId: number
  ) => {
    await moveCandidate(
      applicationId,
      fromStepId,
      toStepId,
      () => {
        setToastType('success');
        setToastMessage('Candidate moved successfully!');
        setTimeout(() => setToastMessage(''), 3000);
      },
      (message) => {
        setToastType('error');
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
      }
    );
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!board) {
    return <ErrorState error={new Error('No board data available')} />;
  }

  const heading = positionName ? `${positionName} Position` : 'Position';

  return (
    <Container fluid className="position-page">
      <header className="position-page__header">
        <button
          type="button"
          className="position-page__back"
          onClick={() => navigate('/positions')}
          aria-label="Back to positions list"
        >
          <ChevronLeft size={28} aria-hidden="true" />
        </button>
        <h1 className="position-page__title">{heading}</h1>
      </header>

      <KanbanBoard board={board} onMoveCandidate={handleMoveCandidate} />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}
    </Container>
  );
};

export default PositionPage;
