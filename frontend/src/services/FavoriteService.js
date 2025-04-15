import AuthService from './AuthService';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Local cache to track pending operations
const pendingOperations = new Map();

const FavoriteService = {
  // Get favorites for current user
  getFavorites: async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return [];
      
      const response = await axios.get(`${API_URL}/favorites`, {
        headers: {
          'Authorization': currentUser.authHeader
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },
  
  // Add a car to favorites
  addFavorite: async (car) => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;
      
      // Add to pending operations
      const operationKey = `add-${car.id}`;
      pendingOperations.set(operationKey, true);
      
      await axios.post(`${API_URL}/favorites`, car, {
        headers: {
          'Authorization': currentUser.authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      pendingOperations.delete(operationKey);
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      
      // Remove from pending operations on error
      pendingOperations.delete(`add-${car.id}`);
      return false;
    }
  },
  
  // Remove a car from favorites
  removeFavorite: async (carId) => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;
      
      // Add to pending operations
      const operationKey = `remove-${carId}`;
      pendingOperations.set(operationKey, true);
      
      await axios.delete(`${API_URL}/favorites/${carId}`, {
        headers: {
          'Authorization': currentUser.authHeader
        }
      });
      
      pendingOperations.delete(operationKey);
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      
      // Remove from pending operations on error
      pendingOperations.delete(`remove-${carId}`);
      return false;
    }
  },
  
  // Toggle favorite status with optimistic UI update
  toggleFavorite: async (car, optimisticUpdateCallback) => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;
    
    try {
      const favorites = await FavoriteService.getFavorites();
      const isFavorite = favorites.some(fav => fav.id === car.id);
      
      // Immediately call the callback for UI update
      if (optimisticUpdateCallback) {
        optimisticUpdateCallback(!isFavorite);
      }
      
      // Then perform the actual operation
      if (isFavorite) {
        await FavoriteService.removeFavorite(car.id);
      } else {
        await FavoriteService.addFavorite(car);
      }
      
      return !isFavorite;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // If there was an error, revert the optimistic update
      if (optimisticUpdateCallback) {
        const favorites = await FavoriteService.getFavorites();
        const isFavorite = favorites.some(fav => fav.id === car.id);
        optimisticUpdateCallback(isFavorite);
      }
      
      return null;
    }
  },
  
  // Check if a car is a favorite
  isFavorite: async (carId) => {
    try {
      const favorites = await FavoriteService.getFavorites();
      return favorites.some(car => car.id === carId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },
  
  // Check if there's a pending operation for this car
  isPending: (carId) => {
    return pendingOperations.has(`add-${carId}`) || pendingOperations.has(`remove-${carId}`);
  }
};

export default FavoriteService;