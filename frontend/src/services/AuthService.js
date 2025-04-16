import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// In-memory storage for user data
let currentUserData = null;

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

      // Send login request to validate credentials
      await axios.post(
        `${API_URL}/login`,
        {}, // Empty body for login validation endpoint
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      // Store auth data in memory upon successful validation
      currentUserData = {
        username,
        authHeader
      };

      // Return some confirmation or user data if needed by the caller
      return { message: 'Login successful', username };

    } catch (error) {
      // Clear in-memory data on login failure
      currentUserData = null;
      if (error.response) {
        // Use the error message from the server if available
        throw new Error(error.response.data.error || error.response.data.message || "Login failed");
      } else if (error.request) {
        throw new Error("No response from server. Please check your connection.");
      } else {
        throw new Error(error.message || "Error setting up request");
      }
    }
  }

  static logout() {
    // Clear in-memory user data
    currentUserData = null;
    // Note: No need to interact with localStorage anymore
  }

  static getCurrentUser() {
    // Return user data from memory
    return currentUserData;
  }

  static isAuthenticated() {
    // Check if user data exists in memory
    return !!currentUserData;
  }

  static getAuthHeader() {
    // Get auth header from in-memory data
    if (currentUserData && currentUserData.authHeader) {
      return { Authorization: currentUserData.authHeader };
    } else {
      return {};
    }
  }
}

export default AuthService;