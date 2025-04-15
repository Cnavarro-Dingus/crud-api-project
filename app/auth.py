from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os

# Setup authentication
auth = HTTPBasicAuth()

# User database file path
USERS_DB_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), 'database/users.json'))

# Ensure users database exists
def ensure_users_db_exists():
    if not os.path.exists(USERS_DB_FILE):
        os.makedirs(os.path.dirname(USERS_DB_FILE), exist_ok=True)
        with open(USERS_DB_FILE, 'w') as f:
            json.dump({}, f, indent=4)

# Read users from database
def read_users_db():
    ensure_users_db_exists()
    with open(USERS_DB_FILE, 'r') as f:
        return json.load(f)

# Write users to database
def write_users_db(users):
    ensure_users_db_exists()
    with open(USERS_DB_FILE, 'w') as f:
        json.dump(users, f, indent=4)

@auth.verify_password
def verify_password(username, password):
    users = read_users_db()
    if username in users and check_password_hash(users[username], password):
        return username
    return None