import React from 'react';
import { Container, Row, Col, Placeholder } from 'react-bootstrap';

/**
 * Loading skeleton for kanban board.
 * Displays placeholder cards while data is being fetched.
 */
const LoadingSkeleton: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Placeholder as="h1" animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        </Col>
      </Row>

      <Row className="g-3">
        {[1, 2, 3].map((i) => (
          <Col key={i} xs={12} sm={6} lg={4}>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={12} size="lg" className="mb-3" />
              <Placeholder xs={12} className="mb-2" />
              <Placeholder xs={12} className="mb-2" />
              <Placeholder xs={8} />
            </Placeholder>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LoadingSkeleton;
