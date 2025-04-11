import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <Form.Group controlId="searchModel" className="search-bar">
      <Form.Label>Search by Model</Form.Label>
      <InputGroup>
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Enter model name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search models"
        />
        {searchTerm && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <FaTimes />
          </Button>
        )}
      </InputGroup>
    </Form.Group>
  );
};

export default SearchBar;
