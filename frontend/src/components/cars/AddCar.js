import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import CarForm from "./CarForm";
import CarService from "../../services/CarService";

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
      <div className="mb-4 text-end">
        <Link to="/" className="btn btn-secondary"> {/* Updated button styling */}
          <FaArrowLeft className="me-2" /> Back to Cars
        </Link>
      </div>
      
      <h2 className="form-page-title mb-4">Add New Car</h2>
      
      {error && <Alert variant="danger" className="form-error" aria-live="assertive">{error}</Alert>} {/* Added ARIA attribute */}
      <CarForm
        initialCar={initialCar}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        navigate={navigate}
      />
    </div>
  );
};

export default AddCar;