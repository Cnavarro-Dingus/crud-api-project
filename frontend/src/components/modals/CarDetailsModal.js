import React, { memo } from "react";
import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import { FaCarSide } from "react-icons/fa";
import AuthService from "../../services/AuthService";
import StarRating from "../common/StarRating";
import ReviewItem from "../common/ReviewItem";
import AddReviewForm from "../common/AddReviewForm";

const CarDetailsModal = memo(({ show, onHide, car, onReviewUpdate }) => {
  if (!car) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="car-details-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="car-details-modal-title"
          className="d-flex align-items-center"
        >
          <FaCarSide className="me-2" />
          {car.make} {car.model} ({car.year})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {car.average_rating !== null && car.average_rating !== undefined && (
          <div className="mb-3 d-flex align-items-center">
            <h5 className="mb-0 me-2">Average Rating:</h5>
            <StarRating rating={car.average_rating} />
            <Badge pill bg="primary" className="ms-2">
              {car.average_rating.toFixed(1)} / 5
            </Badge>
          </div>
        )}

        <h5>Features:</h5>
        {car.features && car.features.length > 0 ? (
          <ListGroup variant="flush" className="mb-3">
            {car.features.map((feature, index) => (
              <ListGroup.Item key={index}>{feature}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="mb-3">No features available for this car.</p>
        )}

        <hr />

        <h5>Reviews ({car.reviews ? car.reviews.length : 0}):</h5>
        {car.reviews && car.reviews.length > 0 ? (
          <ListGroup variant="flush" className="mb-3 review-list">
            {car.reviews.map((review) => (
              <ListGroup.Item key={review.id} className="review-item">
                <ReviewItem
                  review={review}
                  carId={car.id}
                  onUpdate={onReviewUpdate}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="mb-3">No reviews yet for this car.</p>
        )}

        {AuthService.isAuthenticated() && (
          <AddReviewForm carId={car.id} onReviewAdded={onReviewUpdate} />
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
