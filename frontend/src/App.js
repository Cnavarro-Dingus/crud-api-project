import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
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
import {
  FaCar,
  FaPlus,
  FaChartBar,
  FaSignOutAlt,
  FaUser,
  FaBookmark,
} from "react-icons/fa";
import { Spinner } from "react-bootstrap";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [resetPagination, setResetPagination] = useState(false);
  const [resetSort, setResetSort] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AuthService.isAuthenticated();
        setIsAuthenticated(authStatus);
        if (authStatus) {
          const user = await AuthService.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        await AuthService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleAuthChange = async () => {
    try {
      const authStatus = await AuthService.isAuthenticated();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error handling auth change:", error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setResetPagination(true);
    setResetSort(true);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={handleHomeClick}
            style={{ cursor: "pointer" }}
          >
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
                    align="end"
                  >
                    <NavDropdown.Item disabled>
                      Signed in as: {currentUser?.username}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/favorites">
                      <FaBookmark className="me-1" /> My Favorite Cars
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
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleAuthChange} />}
          />
          <Route
            path="/register"
            element={<Register onLoginSuccess={handleAuthChange} />}
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <CarList
                  resetPagination={resetPagination}
                  setResetPagination={setResetPagination}
                  resetSort={resetSort}
                  setResetSort={setResetSort}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddCar />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditCar />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales/:model/:year"
            element={
              <PrivateRoute>
                <SalesDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales-overview"
            element={
              <PrivateRoute>
                <SalesOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoriteCars />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
