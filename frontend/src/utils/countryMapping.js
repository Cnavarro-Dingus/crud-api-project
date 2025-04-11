// Country to continent mapping for filtering
export const countryContinentMap = {
  "United States": "North America", "Canada": "North America", "Mexico": "North America",
  "Brazil": "South America", "Argentina": "South America", "Chile": "South America", 
  "Colombia": "South America", "Peru": "South America", "Venezuela": "South America",
  "United Kingdom": "Europe", "Germany": "Europe", "France": "Europe", "Italy": "Europe", 
  "Spain": "Europe", "Netherlands": "Europe", "Switzerland": "Europe", "Sweden": "Europe", 
  "Belgium": "Europe", "Austria": "Europe", "Poland": "Europe", "Portugal": "Europe", 
  "Greece": "Europe", "Denmark": "Europe", "Norway": "Europe", "Finland": "Europe", 
  "Czech Republic": "Europe", "Hungary": "Europe", "Romania": "Europe", "Ukraine": "Europe", 
  "Ireland": "Europe",
  "China": "Asia", "Japan": "Asia", "South Korea": "Asia", "India": "Asia", "Russia": "Asia", 
  "Thailand": "Asia", "Malaysia": "Asia", "Indonesia": "Asia", "Singapore": "Asia", 
  "Philippines": "Asia", "Vietnam": "Asia", "Israel": "Asia", "Qatar": "Asia", 
  "Saudi Arabia": "Asia", "United Arab Emirates": "Asia",
  "Australia": "Oceania", "New Zealand": "Oceania",
  "South Africa": "Africa", "Egypt": "Africa", "Morocco": "Africa", "Nigeria": "Africa", "Kenya": "Africa"
};

// Helper function to get continent from country
export const getContinentFromCountry = (country) => {
  return countryContinentMap[country] || "Other";
};