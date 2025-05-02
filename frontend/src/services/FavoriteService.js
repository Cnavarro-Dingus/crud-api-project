import AuthService from "./AuthService";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const pendingOperations = new Map();

const FavoriteService = {
  getFavorites: async () => {
    try {
      const authHeader = await AuthService.getAuthHeader();
      if (!authHeader || !authHeader.Authorization) return [];

      const response = await axios.get(`${API_URL}/favorites`, {
        headers: authHeader,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  },

  addFavorite: async (car) => {
    try {
      const authHeader = await AuthService.getAuthHeader();
      if (!authHeader || !authHeader.Authorization) return false;

      const operationKey = `add-${car.id}`;
      pendingOperations.set(operationKey, true);

      await axios.post(`${API_URL}/favorites`, car, {
        headers: {
          ...authHeader,
          "Content-Type": "application/json",
        },
      });

      pendingOperations.delete(operationKey);
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);

      pendingOperations.delete(`add-${car.id}`);
      return false;
    }
  },

  removeFavorite: async (carId) => {
    try {
      const authHeader = await AuthService.getAuthHeader();
      if (!authHeader || !authHeader.Authorization) return false;

      const operationKey = `remove-${carId}`;
      pendingOperations.set(operationKey, true);

      await axios.delete(`${API_URL}/favorites/${carId}`, {
        headers: authHeader,
      });

      pendingOperations.delete(operationKey);
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);

      pendingOperations.delete(`remove-${carId}`);
      return false;
    }
  },

  toggleFavorite: async (car, optimisticUpdateCallback) => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;

    try {
      const favorites = await FavoriteService.getFavorites();
      const isFavorite = favorites.some((fav) => fav.id === car.id);

      if (optimisticUpdateCallback) {
        optimisticUpdateCallback(!isFavorite);
      }

      if (isFavorite) {
        await FavoriteService.removeFavorite(car.id);
      } else {
        await FavoriteService.addFavorite(car);
      }

      return !isFavorite;
    } catch (error) {
      console.error("Error toggling favorite:", error);

      if (optimisticUpdateCallback) {
        const favorites = await FavoriteService.getFavorites();
        const isFavorite = favorites.some((fav) => fav.id === car.id);
        optimisticUpdateCallback(isFavorite);
      }

      return null;
    }
  },

  isFavorite: async (carId) => {
    try {
      const favorites = await FavoriteService.getFavorites();
      return favorites.some((car) => car.id === carId);
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  },

  isPending: (carId) => {
    return (
      pendingOperations.has(`add-${carId}`) ||
      pendingOperations.has(`remove-${carId}`)
    );
  },
};

export default FavoriteService;
