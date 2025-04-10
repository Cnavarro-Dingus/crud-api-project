import axios from "axios";

const API_URL = "http://localhost:5000";

class CarService {
  // Helper method to handle API requests
  static async apiRequest(method, url, data = null) {
    try {
      const config = {
        method,
        url: `${API_URL}${url}`,
        data,
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} request to ${url}:`, error);
      throw error;
    }
  }

  // Car methods
  static getAllCars() {
    return this.apiRequest("get", "/cars");
  }

  static getCarById(id) {
    return this.apiRequest("get", `/cars/${id}`);
  }

  static createCar(car) {
    return this.apiRequest("post", "/cars", car);
  }

  static updateCar(id, car) {
    return this.apiRequest("put", `/cars/${id}`, car);
  }

  static deleteCar(id) {
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
