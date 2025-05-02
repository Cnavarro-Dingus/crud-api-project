import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ searchTerm, setSearchTerm, sortOption, setSortOption }) => {
  const handleClear = () => {
    setSearchTerm("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const sortOptions = [
    { value: "name_asc", label: "Name (A-Z)" },
    { value: "name_desc", label: "Name (Z-A)" },
    { value: "year_asc", label: "Year (ascending)" },
    { value: "year_desc", label: "Year (descending)" },
    { value: "rating_asc", label: "Rating (ascending)" },
    { value: "rating_desc", label: "Rating (descending)" },
  ];

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
          onChange={handleChange}
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
        <Form.Select
          aria-label="Sort cars"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          style={{ maxWidth: 220, marginLeft: 8 }}
        >
          <option value="">Sort by...</option>
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Form.Select>
      </InputGroup>
    </Form.Group>
  );
};

export default SearchBar;
