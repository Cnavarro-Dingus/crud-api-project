import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

class AuthService {
  static async register(username, password) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || "Registration failed");
      } else if (error.request) {
        throw new Error("No response from server. Please check your connection.");
      } else {
        throw new Error(error.message || "Error setting up request");
      }
    }
  }

  static async login(username, password) {
    try {
      // Create Basic Auth header
      const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
      
      const response = await axios.post(
        `${API_URL}/login`,
        {},
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      
      // Store auth data in localStorage
      localStorage.setItem("user", JSON.stringify({
        username,
        authHeader
      }));
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || "Login failed");
      } else if (error.request) {
        throw new Error("No response from server. Please check your connection.");
      } else {
        throw new Error(error.message || "Error setting up request");
      }
    }
  }

  static logout() {
    localStorage.removeItem("user");
  }

  static getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  static isAuthenticated() {
    return !!this.getCurrentUser();
  }

  static getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.authHeader) {
      return { Authorization: user.authHeader };
    } else {
      return {};
    }
  }
}

export default AuthService;