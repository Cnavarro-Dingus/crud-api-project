import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const CarForm = ({ initialCar, onSubmit, error, loading, navigate }) => {
  const [car, setCar] = useState(initialCar);
  const [errors, setErrors] = useState({});
  const [featureInput, setFeatureInput] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle features input
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
        setErrors({ ...errors, features: null });
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
    if (!car.make.trim()) {
      newErrors.make = "Make is required";
    }
    if (!car.model.trim()) {
      newErrors.model = "Model is required";
    }
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(car);
    }
  };

  return (
    <Card className="form-card">
      <Card.Body>
        <Form onSubmit={handleFormSubmit} className="car-form">
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
                isInvalid={!!errors.features}
              />
              <Button
                variant="outline-secondary"
                onClick={addFeature}
                type="button"
              >
                Add
              </Button>
            </div>
            {errors.features && (
              <div className="invalid-feedback d-block">
                {errors.features}
              </div>
            )}

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
              {loading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CarForm;