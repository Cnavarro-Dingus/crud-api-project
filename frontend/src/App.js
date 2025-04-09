import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import CarList from "./components/CarList";
import AddCar from "./components/AddCar";
import EditCar from "./components/EditCar";
import "./App.css";
// Import icons individually to avoid any potential issues
import { FaCar } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <FaCar className="me-2" />
              Car App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/" className="me-3">
                  <FaHome className="me-1" /> Home
                </Nav.Link>
                <Button
                  as={Link}
                  to="/add"
                  variant="success"
                  size="sm"
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-1" /> Add New Car
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<CarList />} />
            <Route path="/add" element={<AddCar />} />
            <Route path="/edit/:id" element={<EditCar />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
