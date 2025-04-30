from flask import Blueprint, jsonify, request
import json
import os
from datetime import datetime
from auth import auth

reviews_bp = Blueprint('reviews', __name__)

REVIEWS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/reviews.json'))
CARS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/db.json'))

def ensure_reviews_db_exists():
    if not os.path.exists(REVIEWS_FILE):
        os.makedirs(os.path.dirname(REVIEWS_FILE), exist_ok=True)
        with open(REVIEWS_FILE, 'w') as f:
            json.dump([], f, indent=4)

def read_reviews_db():
    ensure_reviews_db_exists()
    try:
        with open(REVIEWS_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return [] # Return empty list if file is empty or corrupted

def write_reviews_db(reviews):
    ensure_reviews_db_exists()
    with open(REVIEWS_FILE, 'w') as f:
        json.dump(reviews, f, indent=4)

def read_cars_db():
    # Assuming db.json exists from cars.py logic
    if not os.path.exists(CARS_FILE):
        return []
    with open(CARS_FILE, 'r') as f:
        return json.load(f)

# Helper to find car by ID
def find_car_by_id(car_id):
    cars = read_cars_db()
    return next((car for car in cars if car['id'] == car_id), None)

# GET reviews for a specific car
@reviews_bp.route('/cars/<int:car_id>/reviews', methods=['GET'])
def get_car_reviews(car_id):
    reviews = read_reviews_db()
    car_reviews = [review for review in reviews if review['car_id'] == car_id]
    return jsonify(car_reviews), 200

# POST a new review for a specific car
@reviews_bp.route('/cars/<int:car_id>/reviews', methods=['POST'])
@auth.login_required
def add_car_review(car_id):
    # Check if car exists
    if not find_car_by_id(car_id):
        return jsonify({'error': 'Car not found'}), 404

    data = request.json
    text = data.get('text')
    rating = data.get('rating')
    username = auth.current_user()

    if not text or not rating:
        return jsonify({'error': 'Review text and rating are required'}), 400

    try:
        rating = int(rating)
        if not (1 <= rating <= 5):
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400

    reviews = read_reviews_db()

    # Optional: Check if user already reviewed this car (allow multiple or restrict?)
    # For now, allowing multiple reviews per user per car

    new_review = {
        'id': max(review['id'] for review in reviews) + 1 if reviews else 1,
        'car_id': car_id,
        'user_username': username,
        'text': text,
        'rating': rating,
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat()
    }

    reviews.append(new_review)
    write_reviews_db(reviews)

    return jsonify(new_review), 201

# PUT update an existing review
@reviews_bp.route('/reviews/<int:review_id>', methods=['PUT'])
@auth.login_required
def update_review(review_id):
    data = request.json
    text = data.get('text')
    rating = data.get('rating')
    username = auth.current_user()

    if not text and rating is None: # Check if at least one field is provided
        return jsonify({'error': 'Either review text or rating must be provided for update'}), 400

    reviews = read_reviews_db()
    review_to_update = next((review for review in reviews if review['id'] == review_id), None)

    if not review_to_update:
        return jsonify({'error': 'Review not found'}), 404

    if review_to_update['user_username'] != username:
        return jsonify({'error': 'Forbidden: You can only update your own reviews'}), 403

    if text:
        review_to_update['text'] = text
    if rating is not None:
        try:
            rating = int(rating)
            if not (1 <= rating <= 5):
                raise ValueError()
            review_to_update['rating'] = rating
        except (ValueError, TypeError):
            return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400

    review_to_update['updated_at'] = datetime.utcnow().isoformat()

    write_reviews_db(reviews)
    return jsonify(review_to_update), 200

# DELETE a review
@reviews_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@auth.login_required
def delete_review(review_id):
    username = auth.current_user()
    reviews = read_reviews_db()
    review_to_delete = next((review for review in reviews if review['id'] == review_id), None)

    if not review_to_delete:
        return jsonify({'error': 'Review not found'}), 404

    if review_to_delete['user_username'] != username:
        return jsonify({'error': 'Forbidden: You can only delete your own reviews'}), 403

    reviews = [review for review in reviews if review['id'] != review_id]
    write_reviews_db(reviews)

    return jsonify({'message': 'Review deleted successfully'}), 200