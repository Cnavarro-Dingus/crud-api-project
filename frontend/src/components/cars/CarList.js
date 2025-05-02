import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import CarService from "../../services/CarService";
import SearchBar from "../common/SearchBar";
import {
  FaChartBar,
  FaBackspace,
  FaPencilRuler,
  FaInfoCircle,
  FaBookmark,
} from "react-icons/fa";
import ConfirmationModal from "../modals/ConfirmationModal";
import CarDetailsModal from "../modals/CarDetailsModal";
import { useDebounce } from "../../hooks/useDebounce";
import PaginationComponent from "../common/PaginationComponent";
import FavoriteService from "../../services/FavoriteService";
import StarRating from "../common/StarRating";

const CarList = ({ resetPagination, setResetPagination, resetSort, setResetSort }) => {
  const [cars, setCars] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [pageTransition, setPageTransition] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [sortOption, setSortOption] = useState("");

  // Reiniciar la paginación cuando cambie el filtro de orden
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userFavorites = await FavoriteService.getFavorites();
        const favoritesMap = {};
        userFavorites.forEach((car) => {
          favoritesMap[car.id] = true;
        });
        setFavorites(favoritesMap);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  // Function to map sortOption to sort_by and sort_dir
  const getSortParams = (option) => {
    switch (option) {
      case "name_asc":
        return { sort_by: "name", sort_dir: "asc" };
      case "name_desc":
        return { sort_by: "name", sort_dir: "desc" };
      case "year_asc":
        return { sort_by: "year", sort_dir: "asc" };
      case "year_desc":
        return { sort_by: "year", sort_dir: "desc" };
      case "rating_asc":
        return { sort_by: "rating", sort_dir: "asc" };
      case "rating_desc":
        return { sort_by: "rating", sort_dir: "desc" };
      default:
        return { sort_by: "", sort_dir: "asc" };
    }
  };

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      const { sort_by, sort_dir } = getSortParams(sortOption);
      const { cars, total_count } = await CarService.getAllCars(
        debouncedSearchTerm,
        currentPage,
        itemsPerPage,
        sort_by,
        sort_dir
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
  }, [debouncedSearchTerm, currentPage, itemsPerPage, sortOption]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    if (resetPagination) {
      setCurrentPage(1);
      setPageTransition(false);
      if (typeof setResetPagination === "function") setResetPagination(false);
    }
  }, [resetPagination, setResetPagination]);

  useEffect(() => {
    if (resetSort) {
      setSortOption("");
      if (typeof setResetSort === "function") setResetSort(false);
    }
  }, [resetSort, setResetSort]);
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

        if (favorites[carToDelete]) {
          await FavoriteService.removeFavorite(carToDelete);
          setFavorites((prev) => {
            const newFavorites = { ...prev };
            delete newFavorites[carToDelete];
            return newFavorites;
          });
        }

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

  const handleViewDetails = async (carStub) => {
    setError(null);
    try {
      const fullCarData = await CarService.getCarById(carStub.id);
      setSelectedCar(fullCarData);
      setShowDetailsModal(true);
    } catch (err) {
      setError(
        `Failed to fetch details for ${carStub.model}. Please try again.`
      );
      console.error("Error fetching car details:", err);
      setSelectedCar(null);
      setShowDetailsModal(false);
    }
  };

  const handleReviewUpdate = async () => {
    if (selectedCar) {
      try {
        // Obtener los datos actualizados del coche, incluyendo la nueva valoración media
        const updatedCarData = await CarService.getCarById(selectedCar.id);
        setSelectedCar(updatedCarData); // Actualizar el coche seleccionado en el modal

        // Actualizar la lista de coches en el estado local
        setCars(prevCars => {
          const updatedCars = prevCars.map(car => 
            car.id === selectedCar.id 
              ? { ...car, average_rating: updatedCarData.average_rating } // Actualizar solo la valoración media del coche modificado
              : car
          );

          // Si la ordenación actual es por valoración, reordenar la lista
          if (sortOption === 'rating_asc' || sortOption === 'rating_desc') {
            const { sort_dir } = getSortParams(sortOption);
            return [...updatedCars].sort((a, b) => {
              const valA = parseFloat(a.average_rating) || 0;
              const valB = parseFloat(b.average_rating) || 0;
              if (sort_dir === 'asc') {
                return valA - valB;
              } else {
                return valB - valA;
              }
            });
          }
          
          return updatedCars; // Devolver la lista actualizada sin reordenar si no se ordena por valoración
        });

      } catch (err) {
        setError("Failed to refresh car details after review update.");
        console.error("Error refetching car details:", err);
      } finally {
        // No es necesario hacer nada en finally aquí
      }
    }
  };

  const toggleFavorite = (car) => {
    if (!FavoriteService.isPending(car.id)) {
      setFavorites((prev) => ({
        ...prev,
        [car.id]: !prev[car.id],
      }));

      FavoriteService.toggleFavorite(car, (newState) => {
        setFavorites((prev) => ({
          ...prev,
          [car.id]: newState,
        }));
      });
    }
  };

  return (
    <div className="fade-in">
      <h2 className="page-title">Car List</h2>

      <div className="mb-4 slide-in">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOption={sortOption} setSortOption={setSortOption} />
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
                      <FaBookmark
                        className={`favorite-star ${
                          favorites[car.id] ? "star-favorite" : "star"
                        }`}
                        onClick={() => toggleFavorite(car)}
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
                    <div className="mb-2 average-rating">
                      {car.average_rating !== null && car.average_rating !== undefined ? (
                        <>
                        <strong>Average Rating: </strong>
                          <span style={{ verticalAlign: "middle" }}>
                            <StarRating rating={car.average_rating} />
                          </span>
                          <span style={{ marginLeft: 4 }}>{car.average_rating.toFixed(1)}/5</span>
                        </>
                      ) : (
                        "There are no reviews for this car"
                      )}
                    </div>
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
          onReviewUpdate={handleReviewUpdate}
        />
      )}
    </div>
  );
};

export default CarList;
