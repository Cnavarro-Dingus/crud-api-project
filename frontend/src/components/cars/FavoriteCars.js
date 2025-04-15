import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Button,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { FaChartBar, FaPencilRuler, FaInfoCircle, FaStar, FaArrowLeft, FaBackspace } from "react-icons/fa";
import FavoriteService from "../../services/FavoriteService";
import CarService from "../../services/CarService";
import ConfirmationModal from "../modals/ConfirmationModal";
import CarDetailsModal from "../modals/CarDetailsModal";

const FavoriteCars = () => {
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToRemove, setCarToRemove] = useState(null);
  const [carToDelete, setCarToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = await FavoriteService.getFavorites();
      setFavoriteCars(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setShowDetailsModal(true);
  };

  const handleRemoveFromFavorites = (carId) => {
    // Optimistic UI update - immediately show the car as removed
    setFavoriteCars(prev => prev.filter(car => car.id !== carId));
    
    // Then perform the actual server operation
    FavoriteService.removeFavorite(carId).catch(error => {
      // If there's an error, reload the favorites to get the correct state
      console.error('Error removing favorite:', error);
      loadFavorites();
    });
    
    // Keep the modal functionality if you still want it
    setCarToRemove(carId);
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    if (carToRemove) {
      try {
        await FavoriteService.removeFavorite(carToRemove);
        await loadFavorites();
        setShowRemoveModal(false);
        setCarToRemove(null);
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    }
  };

  const handleDeleteClick = (id) => {
    setCarToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (carToDelete !== null) {
      try {
        await CarService.deleteCar(carToDelete);
        setDeleteMessage("Car deleted successfully!");
        
        // Remove from favorites as well
        FavoriteService.removeFavorite(carToDelete);
        
        // Reload favorites
        loadFavorites();
        
        setTimeout(() => {
          setDeleteMessage("");
        }, 3000);
      } catch (err) {
        setError("Failed to delete car. Please try again.");
        console.error("Error deleting car:", err);
      } finally {
        setShowDeleteModal(false);
        setCarToDelete(null);
      }
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">My Favorite Cars</h2>
        <Link to="/" className="btn btn-outline-secondary">
          <FaArrowLeft className="me-1" /> Back to Car List
        </Link>
      </div>

      {deleteMessage && (
        <Alert
          variant="success"
          onClose={() => setDeleteMessage("")}
          dismissible
          className="slide-in"
        >
          {deleteMessage}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError(null)}
          dismissible
          className="slide-in"
        >
          {error}
        </Alert>
      )}

      {favoriteCars.length === 0 ? (
        <Alert variant="info" className="slide-in">
          You haven't added any cars to your favorites yet.
        </Alert>
      ) : (
        <Row xs={1} md={2} className="g-4 page-transition-in">
          {favoriteCars.map((car) => (
            <Col key={car.id}>
              <Card className="h-100 d-flex flex-column">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    {car.make} {car.model}
                    <FaStar
                      className="favorite-star star-favorite"
                      onClick={() => handleRemoveFromFavorites(car.id)}
                    />
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Year: {car.year}
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1 feature-text-container">
                    <span>Features: </span>
                    <span className="feature-text">
                      {car.features && car.features.length > 0
                        ? car.features.join(", ")
                        : "No features"}
                    </span>
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="btn-action me-2"
                    onClick={() => handleViewDetails(car)}
                  >
                    <FaInfoCircle className="me-1" /> Details
                  </Button>
                  <Link
                    to={`/edit/${car.id}`}
                    className="btn btn-primary btn-sm me-2 btn-action"
                  >
                    <FaPencilRuler className="me-1" /> Edit
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    className="btn-action me-2"
                    onClick={() => handleDeleteClick(car.id)}
                  >
                    <FaBackspace className="me-1" /> Delete
                  </Button>
                  <Link
                    to={`/sales/${car.model}/${car.year}`}
                    className="btn btn-success btn-sm btn-action"
                  >
                    <FaChartBar className="me-1" /> Sales
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <ConfirmationModal
        show={showRemoveModal}
        onHide={() => setShowRemoveModal(false)}
        onConfirm={confirmRemove}
        message="Are you sure you want to remove this car from your favorites?"
        title="Confirm Remove"
      />
      
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this car? This action cannot be undone."
        title="Confirm Delete"
      />
      
      {selectedCar && (
        <CarDetailsModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          car={selectedCar}
        />
      )}
    </div>
  );
};

export default FavoriteCars;