import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

interface BackButtonProps {
  onClick: () => void;
}

/**
 * Navigation button to return to previous page (e.g., positions list).
 * Uses arrow icon from react-bootstrap-icons.
 */
const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={onClick}
      aria-label="Go back to positions"
      className="d-flex align-items-center gap-2"
    >
      <ArrowLeft size={18} />
      Back
    </Button>
  );
};

export default BackButton;
