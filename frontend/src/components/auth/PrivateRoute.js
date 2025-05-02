import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await AuthService.isAuthenticated();
        setIsAuthenticated(auth);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (checking) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
