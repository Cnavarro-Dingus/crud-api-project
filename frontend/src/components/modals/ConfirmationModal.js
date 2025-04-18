import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  message,
  title = "Confirm Action",
}) => {
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!show) return;

      if (e.key === "Escape") {
        onHide();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onHide, onConfirm]); // Ensure dependencies are correct

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      aria-labelledby="confirmation-modal-title" // Added ARIA label
    >
      <Modal.Header closeButton>
        <Modal.Title id="confirmation-modal-title">{title}</Modal.Title> {/* Added ARIA label */}
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} autoFocus>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;