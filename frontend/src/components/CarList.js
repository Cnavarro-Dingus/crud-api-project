import React, { useState, useEffect, useCallback } from "react";
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
import { FaChartBar } from "react-icons/fa";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
      const data = debouncedSearchTerm
        ? await CarService.getCarsByModel(debouncedSearchTerm)
        : await CarService.getAllCars();
      setCars(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cars. Please try again later.");
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm]);

  // Fetch cars based on debounced search term
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Function to handle car deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await CarService.deleteCar(id);
        setCars(cars.filter((car) => car.id !== id));
        setDeleteMessage("Car deleted successfully!");
        setTimeout(() => {
          setDeleteMessage("");
        }, 3000);
      } catch (err) {
        setError("Failed to delete car. Please try again.");
        console.error("Error deleting car:", err);
      }
    }
  };

  // Calculate the cars to display on the current page
  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2 className="page-title">Car List</h2>

      <div className="mb-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {deleteMessage && (
        <Alert
          variant="success"
          onClose={() => setDeleteMessage("")}
          dismissible
        >
          {deleteMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : currentCars.length === 0 ? (
        <Alert variant="info">
          No cars found. Click "Add New Car" to create one.
        </Alert>
      ) : (
        <>
          <Row xs={1} md={2} className="g-4">
            {currentCars.map((car) => (
              <Col key={car.id}>
                <Card className="h-100 d-flex flex-column">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>
                      {car.make} {car.model}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Year: {car.year}
                    </Card.Subtitle>
                    <Card.Text className="flex-grow-1">
                      Features:{" "}
                      {car.features && car.features.length > 0
                        ? car.features.join(", ")
                        : "No features"}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-center">
                    <Link
                      to={`/edit/${car.id}`}
                      className="btn btn-primary btn-sm me-2 btn-action"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      className="btn-action"
                      onClick={() => handleDelete(car.id)}
                    >
                      Delete
                    </Button>
                    <Link
                      to={`/sales/${car.model}/${car.year}`}
                      className="btn btn-info btn-sm btn-action"
                    >
                      <FaChartBar className="me-1" /> Sales
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination className="mt-4 justify-content-center">
            {[...Array(Math.ceil(cars.length / itemsPerPage)).keys()].map(
              (number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              )
            )}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default CarList;
