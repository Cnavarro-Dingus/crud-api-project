import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import CarService from "../services/CarService";
import SearchBar from "./SearchBar";
import { FaChartBar, FaBackspace, FaPencilRuler, FaInfoCircle } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import CarDetailsModal from "./CarDetailsModal"; // We'll create this component

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [pageTransition, setPageTransition] = useState(false);
  const carListRef = useRef(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

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
      setTotalCount(total_count); // Set total count
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
  // Modify the handlePageChange function to include animation
  const handlePageChange = (pageNumber) => {
    if (currentPage !== pageNumber) {
      setPageTransition(true);

      // Add a slight delay before changing the page to allow animation to complete
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
        setCars(cars.filter((car) => car.id !== carToDelete));
        setDeleteMessage("Car deleted successfully!");
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

          {/* Enhanced pagination */}
          <Pagination className="mt-4 justify-content-center pagination-container">
            {totalCount > itemsPerPage && (
              <>
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />

                {[...Array(Math.ceil(totalCount / itemsPerPage)).keys()].map(
                  (number) => {
                    // Show limited page numbers with ellipsis for better UX
                    const pageNumber = number + 1;

                    // Always show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === Math.ceil(totalCount / itemsPerPage) ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    } else if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber ===
                        Math.ceil(totalCount / itemsPerPage) - 1 &&
                        currentPage < Math.ceil(totalCount / itemsPerPage) - 2)
                    ) {
                      // Add ellipsis
                      return (
                        <Pagination.Ellipsis key={`ellipsis-${pageNumber}`} />
                      );
                    }

                    return null;
                  }
                )}

                <Pagination.Next
                  onClick={() =>
                    handlePageChange(
                      Math.min(
                        Math.ceil(totalCount / itemsPerPage),
                        currentPage + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(totalCount / itemsPerPage)
                  }
                />
                <Pagination.Last
                  onClick={() =>
                    handlePageChange(Math.ceil(totalCount / itemsPerPage))
                  }
                  disabled={
                    currentPage === Math.ceil(totalCount / itemsPerPage)
                  }
                />
              </>
            )}
          </Pagination>
        </>
      )}
      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this car? This action cannot be undone."
        title="Confirm Delete"
      />
      
      {/* Details Modal */}
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
