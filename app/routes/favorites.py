from flask import Blueprint, jsonify, request
import json
import os
from auth import auth

favorites_bp = Blueprint('favorites', __name__)

FAVORITES_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/favorites.json'))

def read_favorites_db():
    if not os.path.exists(FAVORITES_FILE):
        with open(FAVORITES_FILE, 'w') as f:
            json.dump({}, f)
        return {}
    
    with open(FAVORITES_FILE, 'r') as f:
        return json.load(f)

def write_favorites_db(favorites):
    with open(FAVORITES_FILE, 'w') as f:
        json.dump(favorites, f, indent=2)

@favorites_bp.route('/favorites', methods=['GET'])
@auth.login_required
def get_favorites():
    username = auth.current_user()
    favorites_db = read_favorites_db()
    
    # Return empty list if user has no favorites
    user_favorites = favorites_db.get(username, [])
    return jsonify(user_favorites)

@favorites_bp.route('/favorites', methods=['POST'])
@auth.login_required
def add_favorite():
    username = auth.current_user()
    car = request.json
    
    favorites_db = read_favorites_db()
    
    # Initialize user's favorites if not exists
    if username not in favorites_db:
        favorites_db[username] = []
    
    # Check if car already in favorites
    for fav in favorites_db[username]:
        if fav['id'] == car['id']:
            return jsonify({"message": "Car already in favorites"}), 400
    
    # Add to favorites
    favorites_db[username].append(car)
    write_favorites_db(favorites_db)
    
    return jsonify({"message": "Car added to favorites"}), 201

@favorites_bp.route('/favorites/<int:car_id>', methods=['DELETE'])
@auth.login_required
def remove_favorite(car_id):
    username = auth.current_user()
    favorites_db = read_favorites_db()
    
    # Check if user has favorites
    if username not in favorites_db:
        return jsonify({"message": "No favorites found"}), 404
    
    # Find and remove car from favorites
    initial_length = len(favorites_db[username])
    favorites_db[username] = [car for car in favorites_db[username] if car['id'] != car_id]
    
    # If no car was removed
    if len(favorites_db[username]) == initial_length:
        return jsonify({"message": "Car not found in favorites"}), 404
    
    write_favorites_db(favorites_db)
    return jsonify({"message": "Car removed from favorites"})