import React, { memo } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { FaCarSide } from "react-icons/fa";

const CarDetailsModal = memo(({ show, onHide, car }) => {
  if (!car) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="car-details-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="car-details-modal-title" className="d-flex align-items-center">
          <FaCarSide className="me-2" />
          {car.make} {car.model} ({car.year})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Features:</h5>
        {car.features && car.features.length > 0 ? (
          <ListGroup variant="flush">
            {car.features.map((feature, index) => (
              <ListGroup.Item key={index}>{feature}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No features available for this car.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CarDetailsModal;