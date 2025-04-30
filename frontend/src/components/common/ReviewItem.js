import React, { useState } from "react";
import { Card, Button, Form, Alert, Spinner, Modal } from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaUserCircle,
  FaSave,
  FaTimes,
  FaStar,
} from "react-icons/fa";
import StarRating from "./StarRating";
import ReviewService from "../../services/ReviewService";
import AuthService from "../../services/AuthService";

const ReviewItem = ({ review, carId, onUpdate }) => {
  const currentUser = AuthService.getCurrentUser();
  const isAuthor = currentUser && currentUser.username === review.user_username;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review.text);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await ReviewService.deleteReview(review.id);
      onUpdate();
    } catch (err) {
      setError("Failed to delete review. Please try again.");
      console.error("Delete review error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await ReviewService.updateReview(review.id, {
        text: editedText,
        rating: editedRating,
      });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError("Failed to update review. Please try again.");
      console.error("Update review error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(review.text);
    setEditedRating(review.rating);
    setError("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        {isEditing ? (
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-2">
              <Form.Label>Rating</Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={25}
                    color={star <= editedRating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => setEditedRating(star)}
                    style={{ cursor: "pointer", marginRight: "5px" }}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Review Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelEdit}
                disabled={loading}
                className="me-2"
              >
                <FaTimes className="me-1" /> Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <FaSave className="me-1" />
                )}
                Save Changes
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-start mb-2 review-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: '60px'}}>
              <div>
                <div className="d-flex align-items-center mb-1">
                  <FaUserCircle size={20} className="me-2 text-muted" />
                  <strong className="me-2">{review.user_username}</strong>
                  <StarRating rating={review.rating} size={16} />
                </div>
                <small className="text-muted">
                  Posted: {formatDate(review.created_at)}
                </small>
              </div>
              {isAuthor && (
                <div className="review-actions" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', minWidth: '48px'}}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="me-1"
                    title="Edit Review"
                    style={{ backgroundColor: '#007bff', color: '#fff' }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={loading}
                    title="Delete Review"
                    style={{ backgroundColor: '#dc3545', color: '#fff' }}
                  >
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      <FaTrash />
                    )}
                  </Button>
                </div>
              )}
            </div>
            <Card.Text>{review.text}</Card.Text>
          </>
        )}

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} style={{ marginLeft: '-7px'}} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this review?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Delete"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default ReviewItem;

<style>{`
  .review-header {
    min-height: 60px;
    align-items: flex-start;
  }
  .review-header > div:first-child {
    min-height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .review-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    min-width: 48px;
    height: 40px;
  }
`}</style>
