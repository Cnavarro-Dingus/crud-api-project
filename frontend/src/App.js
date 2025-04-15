import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap";
import CarList from "./components/cars/CarList";
import AddCar from "./components/cars/AddCar";
import EditCar from "./components/cars/EditCar";
import SalesDetails from "./components/modals/SalesDetails";
import SalesOverview from "./components/sales/SalesOverview";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import AuthService from "./services/AuthService";
import "./App.css";
import FavoriteCars from "./components/cars/FavoriteCars";
import { FaCar, FaPlus, FaChartBar, FaSignOutAlt, FaUser, FaStar } from "react-icons/fa";

function App() {
  // Use state instead of direct function calls
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  // Update auth state when component mounts and when auth changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setCurrentUser(AuthService.getCurrentUser());
    };

    // Check auth on mount
    checkAuth();

    // Set up event listener for auth changes
    window.addEventListener('storage', checkAuth);

    // Clean up
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    window.location.href = "/login";
  };

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
                {isAuthenticated ? (
                  <>
                    <Button
                      as={Link}
                      to="/add"
                      variant="primary"
                      size="sm"
                      className="d-flex align-items-center me-3"
                    >
                      <FaPlus className="me-1" /> Add New Car
                    </Button>
                    <Button
                      as={Link}
                      to="/sales-overview"
                      variant="success"
                      size="sm"
                      className="d-flex align-items-center me-3"
                    >
                      <FaChartBar className="me-1" />
                      Sales Overview
                    </Button>
                    <NavDropdown 
                      title={
                        <span className="user-icon-circle">
                          <FaUser />
                        </span>
                      } 
                      id="profile-dropdown"
                    >
                      <NavDropdown.Item disabled>
                        Signed in as: {currentUser?.username}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/favorites">
                        <FaStar className="me-1" /> My Favorite Cars
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={handleLogout}>
                        <FaSignOutAlt className="me-1" /> Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register">
                      Register
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><CarList /></PrivateRoute>} />
            <Route path="/add" element={<PrivateRoute><AddCar /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><EditCar /></PrivateRoute>} />
            <Route path="/sales/:model/:year" element={<PrivateRoute><SalesDetails /></PrivateRoute>} />
            <Route path="/sales-overview" element={<PrivateRoute><SalesOverview /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><FavoriteCars /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;