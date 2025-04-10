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

  // Get sales data by model
  static async getSalesByModel(model) {
    try {
      const response = await axios.get(`${API_URL}/sales?model=${model}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sales data by model:", error);
      throw error;
    }
  }

  // Get all sales data
  static async getAllSales() {
    try {
      // Set a very high limit to get all sales in one request
      const response = await axios.get(`${API_URL}/sales?limit=1000`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all sales data:", error);
      throw error;
    }
  }

  // Get sales data for a specific car
  static async getSalesForCar(carId) {
    try {
      // First get the car details to get its model and year
      const car = await this.getCarById(carId);
      if (!car) {
        throw new Error(`Car with ID ${carId} not found`);
      }
      
      // Then get all sales for that model and year with a high limit to ensure we get all data
      const response = await axios.get(`${API_URL}/sales?model=${car.model}&release_year=${car.year}&limit=1000`); // Modify this line
      return response.data;
    } catch (error) {
      console.error(`Error fetching sales data for car ID ${carId}:`, error);
      throw error;
    }
  }

  // Get sales data by model and year
  static async getSalesByModelAndYear(model, year) {
    try {
      // Build the URL with parameters, only including release_year if it's defined
      let url = `${API_URL}/sales?model=${model}&limit=1000`;
      if (year && year !== 'undefined') {
        url += `&release_year=${year}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sales data for model ${model} and year ${year}:`, error);
      throw error;
    }
  }
}

export default CarService;
