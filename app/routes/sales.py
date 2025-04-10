from flask import Blueprint, jsonify, request
import json
import os

sales_bp = Blueprint('sales', __name__)

SALES_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/sales.json'))

def read_sales_db():
    if not os.path.exists(SALES_FILE):
        return []
    with open(SALES_FILE, 'r') as f:
        return json.load(f)

@sales_bp.route('/sales', methods=['GET'])
def get_sales():
    country = request.args.get('country')
    model = request.args.get('model')
    sale_year = request.args.get('sale_year')
    release_year = request.args.get('release_year')
    
    # Get pagination parameters, with a default that effectively disables pagination
    # if no specific page/limit is requested
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))  # Default to a high number
    
    sales = read_sales_db()

    # Filter by parameters if provided
    if country:
        sales = [sale for sale in sales if sale['country'].lower() == country.lower()]
    if model:
        sales = [sale for sale in sales if sale['model'].lower() == model.lower()]
    if sale_year:
        try:
            sale_year = int(sale_year)
            sales = [sale for sale in sales if sale['sale_year'] == sale_year]
        except ValueError:
            return jsonify({"error": "Invalid sale_year format. Please provide a valid integer."}), 400
    
    if release_year:
        try:
            release_year = int(release_year)
            sales = [sale for sale in sales if sale['release_year'] == release_year]
        except ValueError:
            return jsonify({"error": "Invalid release_year format. Please provide a valid integer."}), 400

    # Apply pagination only if a reasonable limit is set
    if limit < 1000:
        start = (page - 1) * limit
        end = start + limit
        sales = sales[start:end]

    return jsonify(sales), 200
