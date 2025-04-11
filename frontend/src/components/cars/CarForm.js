import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useFeatures } from "../../hooks/useFeatures"; // Import custom hook
import { validateCar } from "../../utils/validateCar"; // Import validation utility

const CarForm = ({ initialCar, onSubmit, error, loading, navigate }) => {
  const [car, setCar] = useState(initialCar);
  const {
    features,
    featureInput,
    setFeatureInput,
    addFeature,
    removeFeature,
    errors,
    setErrors,
  } = useFeatures(initialCar.features);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle Enter key in feature input
  const handleFeatureKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateCar(car);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ ...car, features });
    }
  };

  return (
    <Card className="form-card slide-in">
      <Card.Body>
        <Form onSubmit={handleFormSubmit} className="car-form">
          <Form.Group className="mb-3" controlId="formMake">
            <Form.Label>Make</Form.Label>
            <Form.Control
              type="text"
              name="make"
              value={car.make}
              onChange={handleChange} // Ensure handleChange is used here
              isInvalid={!!errors.make}
              placeholder="Enter car make (e.g., Toyota)"
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
              onChange={handleChange} // Ensure handleChange is used here
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
              onChange={handleChange} // Ensure handleChange is used here
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
                onKeyDown={handleFeatureKeyDown}
                placeholder="Enter a feature (e.g., Bluetooth, Navigation)"
                className="me-2"
                maxLength="30"
                isInvalid={!!errors.features}
                aria-describedby="featureHelpBlock"
              />
              <Button
                variant="outline-secondary"
                onClick={addFeature}
                type="button"
                disabled={!featureInput.trim()}
              >
                Add
              </Button>
            </div>
            <Form.Text id="featureHelpBlock" muted>
              Press Enter or click Add to add a feature
            </Form.Text>
            {errors.features && (
              <div className="invalid-feedback d-block">{errors.features}</div>
            )}

            {features && features.length > 0 && (
              <div className="mt-2">
                <p className="mb-1">Added features:</p>
                <ul className="list-group">
                  {features.map((feature, index) => (
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
          {/* ... existing form fields ... */}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CarForm;