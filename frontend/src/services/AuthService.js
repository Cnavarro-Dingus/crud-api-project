import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const CACHE_NAME = 'auth-cache';
const AUTH_KEY = 'user-auth-data';
const TOKEN_EXPIRATION_MINUTES = 60; // Token expira en 60 minutos

class AuthService {

  static async _getCache() {
    return await caches.open(CACHE_NAME);
  }

  static async _getCachedAuthData() {
    try {
      const cache = await this._getCache();
      const response = await cache.match(AUTH_KEY);
      if (!response) return null;

      const data = await response.json();

      // Verificar expiración
      if (data.expiresAt && Date.now() > data.expiresAt) {
        await cache.delete(AUTH_KEY); // Eliminar si ha expirado
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error accessing cache:", error);
      return null;
    }
  }

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

      const expiresAt = Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000;
      const authData = {
        username,
        authHeader,
        expiresAt,
      };

      const cache = await this._getCache();
      const responseToCache = new Response(JSON.stringify(authData));
      await cache.put(AUTH_KEY, responseToCache);

      return { message: "Login successful", username };
    } catch (error) {
      // Asegurarse de limpiar la caché en caso de fallo de login
      try {
        const cache = await this._getCache();
        await cache.delete(AUTH_KEY);
      } catch (cacheError) {
        console.error("Error clearing cache on login failure:", cacheError);
      }

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

  static async logout() {
    try {
      const cache = await this._getCache();
      await cache.delete(AUTH_KEY);
    } catch (error) {
      console.error("Error clearing cache on logout:", error);
    }
  }

  static async getCurrentUser() {
    const data = await this._getCachedAuthData();
    return data ? { username: data.username } : null;
  }

  static async isAuthenticated() {
    const data = await this._getCachedAuthData();
    return !!data;
  }

  static async getAuthHeader() {
    const data = await this._getCachedAuthData();
    if (data && data.authHeader) {
      return { Authorization: data.authHeader };
    } else {
      return {};
    }
  }
}

export default AuthService;
