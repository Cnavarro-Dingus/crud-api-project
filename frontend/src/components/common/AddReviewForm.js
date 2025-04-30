import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import ReviewService from "../../services/ReviewService";

const AddReviewForm = ({ carId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !text.trim()) {
      setError("Please provide both a rating and a review text.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await ReviewService.addReview(carId, { rating, text });
      setSuccess("Review added successfully!");
      setRating(0);
      setText("");
      if (onReviewAdded) {
        onReviewAdded();
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add review. Please try again.");
      console.error("Add review error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header as="h6">Add Your Review</Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess("")} dismissible>
            {success}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Your Rating</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={25}
                  color={star <= rating ? "#ffc107" : "#e4e5e9"}
                  onClick={() => setRating(star)}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                />
              ))}
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Your Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts about this car..."
            />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane className="me-1" /> Submit Review
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddReviewForm;
