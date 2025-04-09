import axios from "axios";

const API_URL = "http://localhost:5000";

class CarService {
  // Get all cars
  static async getAllCars() {
    try {
      const response = await axios.get(`${API_URL}/cars`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  }

  // Get a single car by ID
  static async getCarById(id) {
    try {
      const response = await axios.get(`${API_URL}/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching car with id ${id}:`, error);
      throw error;
    }
  }

  // Create a new car
  static async createCar(car) {
    try {
      const response = await axios.post(`${API_URL}/cars`, car);
      return response.data;
    } catch (error) {
      console.error("Error creating car:", error);
      throw error;
    }
  }

  // Update an existing car
  static async updateCar(id, car) {
    try {
      const response = await axios.put(`${API_URL}/cars/${id}`, car);
      return response.data;
    } catch (error) {
      console.error(`Error updating car with id ${id}:`, error);
      throw error;
    }
  }

  // Delete a car
  static async deleteCar(id) {
    try {
      const response = await axios.delete(`${API_URL}/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting car with id ${id}:`, error);
      throw error;
    }
  }

  // Get cars by model
  static async getCarsByModel(model) {
    try {
      const response = await axios.get(`${API_URL}/cars?model=${model}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cars by model:", error);
      throw error;
    }
  }
}

export default CarService;
