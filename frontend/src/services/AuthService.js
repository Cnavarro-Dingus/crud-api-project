import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        throw new Error(error.message || "Error setting up request");
      }
    }
  }

  static async login(username, password) {
    try {
      const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

      await axios.post(
        `${API_URL}/login`,
        {},
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      currentUserData = {
        username,
        authHeader,
      };

      return { message: "Login successful", username };
    } catch (error) {
      currentUserData = null;
      if (error.response) {
        throw new Error(
          error.response.data.error ||
            error.response.data.message ||
            "Login failed"
        );
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        throw new Error(error.message || "Error setting up request");
      }
    }
  }

  static logout() {
    currentUserData = null;
  }

  static getCurrentUser() {
    return currentUserData;
  }

  static isAuthenticated() {
    return !!currentUserData;
  }

  static getAuthHeader() {
    if (currentUserData && currentUserData.authHeader) {
      return { Authorization: currentUserData.authHeader };
    } else {
      return {};
    }
  }
}

export default AuthService;
