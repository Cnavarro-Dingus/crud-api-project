import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaCalendarAlt, FaMapMarkedAlt, FaCarSide } from "react-icons/fa";

const ChartSelector = ({ activeChart, onChartChange }) => {
  return (
    <Card className="chart-selector-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-center">
          <div className="btn-group">
            <Button
              variant={activeChart === "annual" ? "primary" : "outline-primary"}
              onClick={() => onChartChange("annual")}
              className="d-flex align-items-center"
            >
              <FaCalendarAlt className="me-2" /> Annual Sales
            </Button>
            <Button
              variant={activeChart === "country" ? "primary" : "outline-primary"}
              onClick={() => onChartChange("country")}
              className="d-flex align-items-center"
            >
              <FaMapMarkedAlt className="me-2" /> Country Sales
            </Button>
            <Button
              variant={activeChart === "model" ? "primary" : "outline-primary"}
              onClick={() => onChartChange("model")}
              className="d-flex align-items-center"
            >
              <FaCarSide className="me-2" /> Model Sales
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChartSelector;