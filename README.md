# Car CRUD Application

A full-stack web application for managing car inventory and sales data visualization.

## Project Overview

This application provides a comprehensive solution for car inventory management with features including:

- Create, read, update, and delete car records
- Search and filter functionality
- Pagination for efficient data browsing
- Sales data visualization with interactive charts
- Responsive design for desktop and mobile devices

## Project Structure

```bash
crud-api-project/
├── app/                # Flask backend API
│   ├── database/       # Database files (JSON)
│   ├── models/         # Data models
│   ├── routes/         # API endpoints
│   └── scripts/        # Utility scripts
├── frontend/           # React frontend
│   ├── public/         # Static files
│   └── src/            # React source code
│       ├── components/ # React components
│       │   ├── cars/   # Car-related components
│       │   ├── common/ # Reusable UI components
│       │   ├── layout/ # Layout components
│       │   ├── modals/ # Modal dialogs
│       │   └── sales/  # Sales visualization components
│       ├── hooks/      # Custom React hooks
│       ├── services/   # API services
│       └── utils/      # Utility functions
```

## Backend Setup

### Backend Prerequisites

- Miniconda with Python 3.11

### Backend Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a new conda environment with Python 3.11:

   ```bash
   conda create -n car-crud-env python=3.11
   ```

3. Activate the environment:

   ```bash
   conda activate car-crud-env
   ```

4. Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

### Running the Backend

1. Make sure you're in the backend directory with the conda environment activated

2. Start the Flask server:

   ```bash
   python -m app.main
   ```

3. The API will be available at <http://localhost:5000>

## Frontend Setup

### Frontend Prerequisites

- Node.js and npm

### Frontend Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the required packages:

   ```bash
   npm install
   ```

### Running the Frontend

1. Start the development server:

   ```bash
   npm start
   ```

2. The application will be available at <http://localhost:3000>

## API Endpoints

- `GET /cars` - Get all cars
- `POST /cars` - Create a new car
- `PUT /cars/<id>` - Update a car by ID
- `DELETE /cars/<id>` - Delete a car by ID
- `GET /sales/:model/:year` - Get sales details for a specific car model and year
- `GET /sales-overview` - Get an overview of car sales

## React Routes

- `/` - Displays a list of all cars (`CarList` component)
- `/add` - Form for adding a new car (`AddCar` component)
- `/edit/:id` - Form for editing a car by ID (`EditCar` component)
- `/sales/:model/:year` - Displays sales details for a specific car model and year (`SalesDetails` component)
- `/sales-overview` - Displays an overview of car sales (`SalesOverview` component)

## Features

- View a list of all cars
- Add a new car with make, model, and year
- Edit existing car details
- Delete cars from the database
- View sales details for specific car models and years
- View a general overview of car sales
- Form validation for car data
- Responsive design using Bootstrap
