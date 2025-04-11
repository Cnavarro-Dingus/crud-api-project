import json
import os
import random
from datetime import datetime

# Define the path to the database files
DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database'))
CARS_DB_FILE = os.path.join(DB_DIR, 'db.json')
SALES_DB_FILE = os.path.join(DB_DIR, 'sales.json')

# Ensure the database directory exists
os.makedirs(DB_DIR, exist_ok=True)

# Car makes and models
car_makes_models = {
    "Toyota": ["Corolla", "Camry", "RAV4", "Highlander", "Tacoma", "Prius", "Sienna", "4Runner"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "Fit", "HR-V", "Ridgeline"],
    "Ford": ["F-150", "Escape", "Explorer", "Mustang", "Edge", "Ranger", "Bronco", "Focus"],
    "Chevrolet": ["Silverado", "Equinox", "Malibu", "Tahoe", "Traverse", "Camaro", "Suburban", "Colorado"],
    "Nissan": ["Altima", "Rogue", "Sentra", "Pathfinder", "Frontier", "Murano", "Maxima", "Kicks"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series", "X1", "X7", "i4"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "S-Class", "A-Class", "GLA", "GLS"],
    "Audi": ["A4", "Q5", "A6", "Q7", "A3", "Q3", "A8", "e-tron"],
    "Volkswagen": ["Jetta", "Tiguan", "Passat", "Atlas", "Golf", "Taos", "ID.4", "Arteon"],
    "Hyundai": ["Elantra", "Tucson", "Santa Fe", "Sonata", "Kona", "Palisade", "Venue", "Ioniq"],
    "Kia": ["Forte", "Sportage", "Sorento", "Telluride", "Soul", "Seltos", "K5", "Carnival"],
    "Subaru": ["Outback", "Forester", "Crosstrek", "Impreza", "Ascent", "Legacy", "WRX", "BRZ"],
    "Mazda": ["CX-5", "Mazda3", "CX-9", "Mazda6", "CX-30", "MX-5 Miata", "CX-50", "MX-30"],
    "Lexus": ["RX", "ES", "NX", "GX", "IS", "UX", "LX", "LS"],
    "Jeep": ["Grand Cherokee", "Wrangler", "Cherokee", "Compass", "Renegade", "Gladiator", "Wagoneer", "Grand Wagoneer"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck", "Roadster", "Semi", "Model 2"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "718 Cayman", "718 Boxster", "Cayenne Coupe"],
    "Volvo": ["XC90", "XC60", "S60", "XC40", "V60", "S90", "V90", "C40"],
    "Land Rover": ["Range Rover", "Discovery", "Defender", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar", "Discovery Sport", "Freelander"],
    "Jaguar": ["F-Pace", "E-Pace", "I-Pace", "XF", "XE", "F-Type", "XJ", "XK"],
    "Acura": ["MDX", "RDX", "TLX", "ILX", "NSX", "RLX", "TL", "TSX"],
    "Infiniti": ["QX60", "QX50", "Q50", "QX80", "QX55", "Q60", "QX30", "Q70"],
    "Cadillac": ["Escalade", "XT5", "CT5", "XT4", "CT4", "XT6", "Lyriq", "Celestiq"],
    "Lincoln": ["Navigator", "Aviator", "Corsair", "Nautilus", "MKZ", "Continental", "MKC", "MKX"],
    "Buick": ["Enclave", "Encore", "Envision", "Regal", "LaCrosse", "Verano", "Cascada", "Encore GX"],
    "GMC": ["Sierra", "Terrain", "Acadia", "Yukon", "Canyon", "Savana", "Hummer EV", "Yukon XL"],
    "Chrysler": ["Pacifica", "300", "Voyager", "Town & Country", "200", "Sebring", "PT Cruiser", "Aspen"],
    "Dodge": ["Charger", "Challenger", "Durango", "Journey", "Grand Caravan", "Dart", "Viper", "Magnum"],
    "Ram": ["1500", "2500", "3500", "ProMaster", "ProMaster City", "Dakota", "Cargo Van", "Chassis Cab"],
    "Mitsubishi": ["Outlander", "Eclipse Cross", "Outlander Sport", "Mirage", "Lancer", "Galant", "Endeavor", "i-MiEV"],
    "Genesis": ["G80", "GV80", "G70", "GV70", "G90", "GV60", "X", "Essentia"],
    "Fiat": ["500", "500X", "500L", "124 Spider", "500e", "500 Abarth", "Tipo", "Panda"],
    "Alfa Romeo": ["Giulia", "Stelvio", "4C", "Tonale", "Giulietta", "MiTo", "8C", "Brera"],
    "Maserati": ["Ghibli", "Levante", "Quattroporte", "MC20", "GranTurismo", "GranCabrio", "Grecale", "Alfieri"],
    "Ferrari": ["F8 Tributo", "Roma", "SF90 Stradale", "296 GTB", "812 Superfast", "Portofino", "Purosangue", "Daytona SP3"],
    "Lamborghini": ["Urus", "Huracán", "Aventador", "Sián", "Revuelto", "Countach LPI 800-4", "Gallardo", "Murciélago"],
    "Bentley": ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne", "Bacalar", "Batur", "Azure", "Brooklands"],
    "Rolls-Royce": ["Phantom", "Ghost", "Cullinan", "Wraith", "Dawn", "Spectre", "Silver Shadow", "Corniche"],
    "Aston Martin": ["DBX", "Vantage", "DB11", "DBS Superleggera", "Valkyrie", "Valour", "Vanquish", "Rapide"],
    "McLaren": ["720S", "Artura", "765LT", "GT", "Elva", "Senna", "Speedtail", "P1"],
    "Bugatti": ["Chiron", "Mistral", "Bolide", "Centodieci", "Divo", "La Voiture Noire", "Veyron", "EB110"]
}

# Features for cars
car_features = [
    "Bluetooth", "Navigation", "Leather Seats", "Sunroof", "Backup Camera", 
    "Heated Seats", "Keyless Entry", "Cruise Control", "Lane Departure Warning",
    "Blind Spot Monitoring", "Parking Sensors", "Apple CarPlay", "Android Auto",
    "Wireless Charging", "Premium Sound System", "Adaptive Cruise Control",
    "Panoramic Roof", "Ventilated Seats", "Heads-up Display", "360-degree Camera",
    "Automatic Emergency Braking", "Remote Start", "Power Liftgate", "Third Row Seating",
    "Ambient Lighting", "Driver Assistance Package", "Night Vision", "Massage Seats",
    "Air Suspension", "All-Wheel Drive", "Towing Package", "Off-Road Package",
    "Sport Package", "Premium Package", "Technology Package", "Luxury Package",
    "Performance Package", "Cold Weather Package", "Convenience Package", "Safety Package"
]

# Countries for sales data
countries = [
    "United States", "China", "Japan", "Germany", "United Kingdom", "France", "Italy", 
    "Canada", "South Korea", "Australia", "Brazil", "India", "Russia", "Spain", 
    "Mexico", "Netherlands", "Switzerland", "Sweden", "Belgium", "Austria", 
    "Poland", "Turkey", "Saudi Arabia", "United Arab Emirates", "South Africa",
    "Argentina", "Chile", "Colombia", "Peru", "Venezuela", "Thailand", "Malaysia",
    "Indonesia", "Singapore", "Philippines", "Vietnam", "New Zealand", "Ireland",
    "Portugal", "Greece", "Denmark", "Norway", "Finland", "Czech Republic", "Hungary",
    "Romania", "Ukraine", "Egypt", "Morocco", "Nigeria", "Kenya", "Israel", "Qatar"
]

def generate_cars(num_cars=2000):
    """Generate a specified number of car records."""
    cars = []
    for i in range(num_cars):
        make = random.choice(list(car_makes_models.keys()))
        model = random.choice(car_makes_models[make])
        
        # Generate a realistic year between 1990 and 2023
        year = random.randint(1990, 2023)
        
        # Generate 1-5 random features
        num_features = random.randint(1, 5)
        features = random.sample(car_features, num_features)
        
        cars.append({
            "id": i,
            "make": make,
            "model": model,
            "year": year,
            "features": features
        })
    
    return cars

def generate_sales(cars, num_sales=10000):
    """Generate sales data based on the cars."""
    sales = []
    sale_id = 0
    
    for _ in range(num_sales):
        # Pick a random car
        car = random.choice(cars)
        
        # Generate sale year (between car year and current year)
        current_year = datetime.now().year
        sale_year = random.randint(car["year"], current_year)
        
        # Generate random units sold (1-100)
        units_sold = random.randint(1, 100)
        
        # Pick a random country
        country = random.choice(countries)
        
        sales.append({
            "id": sale_id,
            "car_id": car["id"],
            "make": car["make"],
            "model": car["model"],
            "release_year": car["year"],
            "sale_year": sale_year,
            "units_sold": units_sold,
            "country": country
        })
        
        sale_id += 1
    
    return sales

def save_to_json(data, file_path):
    """Save data to a JSON file."""
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

def main():
    # Generate cars - increased to 2000
    print("Generating car data...")
    cars = generate_cars(2000)  # Generate 2000 cars
    
    # Generate sales - increased to 10000
    print("Generating sales data...")
    sales = generate_sales(cars, 10000)  # Generate 10000 sales records
    
    # Save to JSON files
    print(f"Saving car data to {CARS_DB_FILE}...")
    save_to_json(cars, CARS_DB_FILE)
    
    print(f"Saving sales data to {SALES_DB_FILE}...")
    save_to_json(sales, SALES_DB_FILE)
    
    print(f"Generated {len(cars)} cars and {len(sales)} sales records.")

if __name__ == "__main__":
    main()