import axios from "axios";
import AuthService from "./AuthService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthHeader = () => {
  return AuthService.getAuthHeader();
};

class ReviewService {
  static async apiRequest(method, url, data = null) {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    };

    try {
      const config = {
        method,
        url: `${API_URL}${url}`,
        data,
        headers
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} request to ${url}:`, error);
      if (error.response) {
        const errorObj = new Error(error.response.data.error || "Server error");
        errorObj.status = error.response.status;
        errorObj.data = error.response.data;
        throw errorObj;
      } else if (error.request) {
        const errorObj = new Error("No response from server. Please check your connection.");
        errorObj.status = 0;
        throw errorObj;
      } else {
        const errorObj = new Error(error.message || "Error setting up request");
        errorObj.status = -1;
        throw errorObj;
      }
    }
  }

  static getReviewsForCar(carId) {
    return this.apiRequest("get", `/cars/${carId}/reviews`);
  }

  static addReview(carId, reviewData) {
    return this.apiRequest("post", `/cars/${carId}/reviews`, reviewData);
  }

  static updateReview(reviewId, reviewData) {
    return this.apiRequest("put", `/reviews/${reviewId}`, reviewData);
  }

  static deleteReview(reviewId) {
    return this.apiRequest("delete", `/reviews/${reviewId}`);
  }
}

export default ReviewService;