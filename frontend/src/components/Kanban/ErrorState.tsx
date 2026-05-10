import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

interface ErrorStateProps {
  error: Error;
}

/**
 * Error state component for kanban board.
 * Displays error message and provides navigation back.
 */
const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Container className="py-4">
      <Alert variant="danger" className="d-flex justify-content-between align-items-center">
        <div>
          <Alert.Heading>Error loading kanban board</Alert.Heading>
          <p>{error.message}</p>
        </div>
        <Button
          variant="outline-danger"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Alert>
    </Container>
  );
};

export default ErrorState;
