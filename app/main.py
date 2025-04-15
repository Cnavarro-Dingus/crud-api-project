from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from routes.cars import cars_bp
from routes.sales import sales_bp
from routes.favorites import favorites_bp
from auth import auth, read_users_db, write_users_db

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register blueprints
app.register_blueprint(cars_bp)
app.register_blueprint(sales_bp)
app.register_blueprint(favorites_bp)

# User registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    users = read_users_db()
    
    if username in users:
        return jsonify({'error': 'Username already exists'}), 400
    
    users[username] = generate_password_hash(password)
    write_users_db(users)
    
    return jsonify({'message': 'User registered successfully'}), 201

# User login endpoint (for validation)
@app.route('/login', methods=['POST'])
@auth.login_required
def login():
    return jsonify({'message': 'Login successful', 'username': auth.current_user()}), 200

if __name__ == '__main__':
    app.run(debug=True)