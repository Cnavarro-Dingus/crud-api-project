import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import CarForm from "./CarForm";
import CarService from "../services/CarService";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const fetchedCar = await CarService.getCarById(id);
        setCar(fetchedCar);
      } catch (err) {
        setError("Failed to fetch car details. Please try again later.");
        console.error("Error fetching car:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleSubmit = async (updatedCar) => {
    setSubmitting(true);
    setError(null);
    try {
      await CarService.updateCar(id, updatedCar);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Error updating car:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-4 text-end">
        <Link to="/" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Back to Cars
        </Link>
      </div>
      
      <h2 className="form-page-title mb-4">Edit Car</h2>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3">Loading car data...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <CarForm
          initialCar={car}
          onSubmit={handleSubmit}
          error={error}
          loading={submitting}
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default EditCar;
