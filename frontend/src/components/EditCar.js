import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import CarService from "../services/CarService";
import CarForm from "./CarForm";

const EditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const fetchedCar = await CarService.getCarById(id);
        setCar(fetchedCar);
      } catch (err) {
        setError("Failed to fetch car details. Please try again later.");
        console.error("Error fetching car:", err);
      }
    };
    fetchCar();
  }, [id]);

  const handleSubmit = async (updatedCar) => {
    setLoading(true);
    setError(null);
    try {
      await CarService.updateCar(id, updatedCar);
      setError(null);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Error updating car:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!car) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" className="pulse">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 className="page-title">Edit Car</h2>
      {error && (
        <Alert
          variant="danger"
          onClose={() => setError(null)}
          dismissible
          className="form-error slide-in"
        >
          {error}
        </Alert>
      )}
      <CarForm
        initialCar={car}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        navigate={navigate}
      />
    </div>
  );
};

export default EditCar;
