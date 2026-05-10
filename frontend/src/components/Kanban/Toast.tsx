import React, { useEffect } from 'react';
import { Toast as BootstrapToast, ToastContainer } from 'react-bootstrap';
import { CheckCircle, ExclamationCircle } from 'react-bootstrap-icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  autoClose?: number;
}

/**
 * Toast notification component for user feedback.
 * Auto-dismisses after specified duration.
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  autoClose = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, autoClose);
    return () => clearTimeout(timer);
  }, [onClose, autoClose]);

  const bgColor = type === 'success' ? 'success' : 'danger';
  const Icon = type === 'success' ? CheckCircle : ExclamationCircle;

  return (
    <ToastContainer position="bottom-end" className="p-3">
      <BootstrapToast
        onClose={onClose}
        show={true}
        delay={autoClose}
        autohide
        bg={bgColor}
        className="text-white"
      >
        <BootstrapToast.Body className="d-flex align-items-center gap-2">
          <Icon size={20} />
          {message}
        </BootstrapToast.Body>
      </BootstrapToast>
    </ToastContainer>
  );
};

export default Toast;
