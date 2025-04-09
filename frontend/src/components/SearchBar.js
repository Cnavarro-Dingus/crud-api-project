import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa"; // Import the magnifying glass icon

const SearchBar = ({ searchTerm, setSearchTerm }) => {
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
        />
      </InputGroup>
    </Form.Group>
  );
};

export default SearchBar;
