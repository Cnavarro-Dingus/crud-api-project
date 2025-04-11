import React from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";

const FilterCard = ({ 
  selectedYear, 
  setSelectedYear, 
  selectedContinent, 
  setSelectedContinent, 
  selectedMake, 
  setSelectedMake,
  availableYears,
  availableMakes,
  continents,
  activeChart,
  topModelsCount,
  setTopModelsCount
}) => {
  return (
    <Card className="mb-4 filter-card">
      <Card.Body>
        <Card.Title>
          <FaFilter className="me-2" /> Filter Options
        </Card.Title>
        <Row className="mt-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="all">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Continent</Form.Label>
              <Form.Select 
                value={selectedContinent} 
                onChange={(e) => setSelectedContinent(e.target.value)}
              >
                <option value="all">All Continents</option>
                {continents.map(continent => (
                  <option key={continent} value={continent}>{continent}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Make</Form.Label>
              <Form.Select 
                value={selectedMake} 
                onChange={(e) => setSelectedMake(e.target.value)}
              >
                <option value="all">All Makes</option>
                {availableMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {activeChart === "model" && (
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Show Top Models</Form.Label>
                <Form.Select 
                  value={topModelsCount} 
                  onChange={(e) => setTopModelsCount(parseInt(e.target.value))}
                >
                  <option value="10">Top 10</option>
                  <option value="20">Top 20</option>
                  <option value="50">Top 50</option>
                  <option value="100">Top 100</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default FilterCard;