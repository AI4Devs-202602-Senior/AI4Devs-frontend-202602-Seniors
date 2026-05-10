import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { usePositionBoard } from '../hooks/usePositionBoard';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import BackButton from '../components/Kanban/BackButton';
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

  return (
    <Container fluid className="position-page py-4">
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <BackButton onClick={() => navigate('/positions')} />
        </Col>
        <Col>
          <h1 className="mb-0">{positionName || 'Position Details'}</h1>
          <p className="text-muted">Manage candidates through interview stages</p>
        </Col>
      </Row>

      <KanbanBoard
        board={board}
        onMoveCandidate={handleMoveCandidate}
      />

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
