import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import CarService from "../../services/CarService";
import SearchBar from "../common/SearchBar";
import { FaChartBar, FaBackspace, FaPencilRuler, FaInfoCircle } from "react-icons/fa";
import ConfirmationModal from "../modals/ConfirmationModal";
import CarDetailsModal from "../modals/CarDetailsModal";
import { useDebounce } from "../../hooks/useDebounce"; // Import custom hook
import PaginationComponent from "../common/PaginationComponent"; // Import pagination component

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Use custom hook
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [pageTransition, setPageTransition] = useState(false);
  const carListRef = useRef(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Function to fetch cars
  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      const { cars, total_count } = await CarService.getAllCars(
        debouncedSearchTerm,
        currentPage,
        itemsPerPage
      );
      setCars(cars);
      setTotalCount(total_count);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cars. Please try again later.");
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, itemsPerPage]);

  // Fetch cars based on debounced search term
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (currentPage !== pageNumber) {
      setPageTransition(true);
      setTimeout(() => {
        setCurrentPage(pageNumber);
        setPageTransition(false);
      }, 300);
    }
  };

  const handleDeleteClick = (id) => {
    setCarToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (carToDelete !== null) {
      try {
        await CarService.deleteCar(carToDelete);
        setDeleteMessage("Car deleted successfully!");
        
        // Refetch cars after successful deletion
        fetchCars();
        
        setTimeout(() => {
          setDeleteMessage("");
        }, 3000);
      } catch (err) {
        setError("Failed to delete car. Please try again.");
        console.error("Error deleting car:", err);
      } finally {
        setShowModal(false);
        setCarToDelete(null);
      }
    }
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setShowDetailsModal(true);
  };

  return (
    <div className="fade-in">
      <h2 className="page-title">Car List</h2>

      <div className="mb-4 slide-in">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" className="pulse">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : cars.length === 0 ? (
        <Alert variant="info" className="slide-in">
          No cars found. Click "Add New Car" to create one.
        </Alert>
      ) : (
        <>
          <Row
            xs={1}
            md={2}
            className={`g-4 ${
              pageTransition ? "page-transition-out" : "page-transition-in"
            }`}
            ref={carListRef}
          >
            {cars.map((car, index) => (
              <Col key={car.id}>
                <Card
                  className="h-100 d-flex flex-column"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>
                      {car.make} {car.model}
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

          <PaginationComponent
            totalCount={totalCount}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
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

export default CarList;