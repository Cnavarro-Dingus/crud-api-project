# Car CRUD Application

This is a full-stack CRUD (Create, Read, Update, Delete) application for managing cars. It consists of a Flask backend API and a React frontend.

## Project Structure

```
crude-api-project/
├── backend/            # Flask backend API
│   ├── app/            # Application code
│   │   ├── database/   # Database files
│   │   ├── models/     # Data models
│   │   └── routes/     # API endpoints
│   ├── database/       # JSON database file
│   └── tests/          # Test files
└── frontend/           # React frontend
    ├── public/         # Static files
    └── src/            # React source code
        ├── components/ # React components
        └── services/   # API services
```

## Backend Setup

### Prerequisites

- Miniconda with Python 3.11

### Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a new conda environment with Python 3.11:
   ```
   conda create -n car-crud-env python=3.11
   ```

3. Activate the environment:
   ```
   conda activate car-crud-env
   ```

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

### Running the Backend

1. Make sure you're in the backend directory with the conda environment activated

2. Start the Flask server:
   ```
   python -m app.main
   ```

3. The API will be available at http://localhost:5000

## Frontend Setup

### Prerequisites

- Node.js and npm

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required packages:
   ```
   npm install
   ```

### Running the Frontend

1. Start the development server:
   ```
   npm start
   ```

2. The application will be available at http://localhost:3000

## API Endpoints

- `GET /cars` - Get all cars
- `POST /cars` - Create a new car
- `PUT /cars/<id>` - Update a car by ID
- `DELETE /cars/<id>` - Delete a car by ID

## Features

- View a list of all cars
- Add a new car with make, model, and year
- Edit existing car details
- Delete cars from the database
- Form validation for car data
- Responsive design using Bootstrap