import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import CarService from "../services/CarService";
import CarForm from "./CarForm";

const AddCar = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialCar = {
    make: "",
    model: "",
    year: "",
    features: [],
  };

  const handleSubmit = async (car) => {
    setLoading(true);
    setError(null);
    try {
      await CarService.createCar(car);
      setError(null);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Error adding car:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h2 className="page-title">Add New Car</h2>
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
        initialCar={initialCar}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default AddCar;
