import axios from "axios";
import AuthService from "./AuthService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const cache = {
  data: {},
  timeout: {},
  get: function (key) {
    return this.data[key];
  },
  set: function (key, value, expirationInMinutes = 5) {
    this.data[key] = value;

    if (this.timeout[key]) {
      clearTimeout(this.timeout[key]);
    }

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

const getAuthHeader = () => {
  return AuthService.getAuthHeader();
};

class CarService {
  static async apiRequest(method, url, data = null, useCache = false) {
    const cacheKey = `${method}-${url}-${JSON.stringify(data)}`;
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

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
        headers,
      };
      const response = await axios(config);

      if (useCache && method.toLowerCase() === "get") {
        cache.set(cacheKey, response.data);
      }

      return response.data;
    } catch (error) {
      console.error(`Error in ${method} request to ${url}:`, error);

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

  static getAllCars(model = "", page = 1, limit = 6, sort_by = "", sort_dir = "asc") {
    const params = [];
    if (model) params.push(`model=${encodeURIComponent(model)}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    if (sort_by) params.push(`sort_by=${encodeURIComponent(sort_by)}`);
    if (sort_dir) params.push(`sort_dir=${encodeURIComponent(sort_dir)}`);
    const queryString = params.length ? `?${params.join("&")}` : "";
    return this.apiRequest(
      "get",
      `/cars${queryString}`,
      null,
      true
    );
  }

  static getCarById(id) {
    return this.apiRequest("get", `/cars/${id}`);
  }

  static createCar(car) {
    cache.clear();
    return this.apiRequest("post", "/cars", car);
  }

  static updateCar(id, car) {
    cache.clear();
    return this.apiRequest("put", `/cars/${id}`, car);
  }

  static deleteCar(id) {
    cache.clear();
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
