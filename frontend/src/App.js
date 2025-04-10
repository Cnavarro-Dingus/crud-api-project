import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import CarList from "./components/CarList";
import AddCar from "./components/AddCar";
import EditCar from "./components/EditCar";
import SalesDetails from "./components/SalesDetails";
import SalesOverview from "./components/SalesOverview";
import "./App.css";
import { FaCar, FaPlus, FaHome, FaChartBar } from "react-icons/fa";

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
                  className="d-flex align-items-center me-3"
                >
                  <FaPlus className="me-1" /> Add New Car
                </Button>
                <Button
                  as={Link}
                  to="/sales-overview"
                  variant="info"
                  size="sm"
                  className="d-flex align-items-center"
                >
                  <FaChartBar className="me-1" />
                  Sales Overview
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
            <Route path="/sales/:model/:year" element={<SalesDetails />} />
            <Route path="/sales-overview" element={<SalesOverview />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
