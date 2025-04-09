import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import CarService from "../services/CarService";

const EditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState({
    make: "",
    model: "",
    year: "",
    features: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carData = await CarService.getCarById(id);
        setCar(carData);
      } catch (err) {
        console.error("Error fetching car:", err);
        setError("Failed to load car data.");
      }
    };

    fetchCar();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle features input
  const [featureInput, setFeatureInput] = useState("");

  const addFeature = () => {
    const normalizedFeature = featureInput.trim().toLowerCase();
    if (normalizedFeature) {
      const normalizedFeatures = car.features.map((f) => f.toLowerCase());
      if (normalizedFeatures.includes(normalizedFeature)) {
        setErrors({ ...errors, features: "Feature already exists" });
      } else {
        setCar({
          ...car,
          features: [...car.features, featureInput.trim()],
        });
        setFeatureInput("");
        setErrors({ ...errors, features: null }); // Clear feature error
      }
    }
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...car.features];
    updatedFeatures.splice(index, 1);
    setCar({
      ...car,
      features: updatedFeatures,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate make
    if (!car.make.trim()) {
      newErrors.make = "Make is required";
    }

    // Validate model
    if (!car.model.trim()) {
      newErrors.model = "Model is required";
    }

    // Validate year
    if (!car.year) {
      newErrors.year = "Year is required";
    } else {
      const yearNum = parseInt(car.year);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Use validateForm to check for errors
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Ensure the data meets validation criteria
    const updatedCar = {
      make: car.make.trim(),
      model: car.model.trim(),
      year: parseInt(car.year, 10), // Ensure year is an integer
      features: car.features,
    };

    try {
      await CarService.updateCar(id, updatedCar);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Display specific error message from backend
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Error updating car:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="form-card">
      <Card.Body>
        <h2 className="page-title">Edit Car</h2>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="car-form">
          <Form.Group className="mb-3" controlId="formMake">
            <Form.Label>Make</Form.Label>
            <Form.Control
              type="text"
              name="make"
              value={car.make}
              onChange={handleChange}
              isInvalid={!!errors.make}
              placeholder="Enter car make (e.g., Toyota, Honda)"
            />
            <Form.Control.Feedback type="invalid">
              {errors.make}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formModel">
            <Form.Label>Model</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={car.model}
              onChange={handleChange}
              isInvalid={!!errors.model}
              placeholder="Enter car model (e.g., Corolla, Civic)"
            />
            <Form.Control.Feedback type="invalid">
              {errors.model}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formYear">
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={car.year}
              onChange={handleChange}
              isInvalid={!!errors.year}
              placeholder="Enter car year (e.g., 2023)"
              min="1900"
            />
            <Form.Control.Feedback type="invalid">
              {errors.year}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFeatures">
            <Form.Label>Features</Form.Label>
            <div className="d-flex mb-2">
              <Form.Control
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Enter a feature (e.g., Bluetooth, Navigation)"
                className="me-2"
                maxLength="30"
                isInvalid={!!errors.features} // Ensure this line is present to show error state
              />
              <Button
                variant="outline-secondary"
                onClick={addFeature}
                type="button"
              >
                Add
              </Button>
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.features}
            </Form.Control.Feedback>

            {car.features && car.features.length > 0 && (
              <div className="mt-2">
                <p className="mb-1">Added features:</p>
                <ul className="list-group">
                  {car.features.map((feature, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {feature}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Car"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditCar;
