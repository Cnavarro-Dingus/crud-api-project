import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Use environment variable

// Simple cache implementation
const cache = {
  data: {},
  timeout: {},
  get: function (key) {
    return this.data[key];
  },
  set: function (key, value, expirationInMinutes = 5) {
    this.data[key] = value;

    // Clear any existing timeout
    if (this.timeout[key]) {
      clearTimeout(this.timeout[key]);
    }

    // Set expiration
    this.timeout[key] = setTimeout(() => {
      delete this.data[key];
      delete this.timeout[key];
    }, expirationInMinutes * 60 * 1000);
  },
  clear: function () {
    this.data = {};
    Object.values(this.timeout).forEach((timeout) => clearTimeout(timeout));
    this.timeout = {};
  },
};

class CarService {
  // Helper method to handle API requests
  static async apiRequest(method, url, data = null, useCache = false) {
    const cacheKey = `${method}-${url}-${JSON.stringify(data)}`;

    // Return cached data if available and requested
    if (useCache && method.toLowerCase() === "get") {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const config = {
        method,
        url: `${API_URL}${url}`,
        data,
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios(config);

      // Cache GET responses if requested
      if (useCache && method.toLowerCase() === "get") {
        cache.set(cacheKey, response.data);
      }

      return response.data;
    } catch (error) {
      console.error(`Error in ${method} request to ${url}:`, error);

      // Enhanced error handling
      if (error.response) {
        const errorObj = new Error(error.response.data.error || "Server error");
        errorObj.status = error.response.status;
        errorObj.data = error.response.data;
        throw errorObj;
      } else if (error.request) {
        const errorObj = new Error(
          "No response from server. Please check your connection."
        );
        errorObj.status = 0;
        throw errorObj;
      } else {
        const errorObj = new Error(error.message || "Error setting up request");
        errorObj.status = -1;
        throw errorObj;
      }
    }
  }

  static getAllCars(model = "", page = 1, limit = 6) {
    return this.apiRequest(
      "get",
      `/cars?model=${model}&page=${page}&limit=${limit}`,
      null,
      true
    );
  }

  static getCarById(id) {
    return this.apiRequest("get", `/cars/${id}`);
  }

  static createCar(car) {
    cache.clear(); // Clear cache after data modification
    return this.apiRequest("post", "/cars", car);
  }

  static updateCar(id, car) {
    cache.clear(); // Clear cache after data modification
    return this.apiRequest("put", `/cars/${id}`, car);
  }

  static deleteCar(id) {
    cache.clear(); // Clear cache after data modification
    return this.apiRequest("delete", `/cars/${id}`);
  }

  static getCarsByModel(model) {
    return this.apiRequest("get", `/cars?model=${model}`);
  }

  // Sales methods
  static getAllSales() {
    return this.apiRequest("get", "/sales");
  }

  static getSalesByModel(model) {
    return this.apiRequest("get", `/sales?model=${model}`);
  }

  static getSalesByModelAndYear(model, year) {
    return this.apiRequest("get", `/sales?model=${model}&release_year=${year}`);
  }
}

export default CarService;