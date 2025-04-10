class Sale:
    def __init__(self, sale_year, make, model, release_year, country, units_sold):
        self.sale_year = sale_year
        self.make = make
        self.model = model
        self.release_year = release_year
        self.country = country
        self.units_sold = units_sold

    def to_dict(self):
        return {
            "sale_year": self.sale_year,
            "make": self.make,
            "model": self.model,
            "release_year": self.release_year,
            "country": self.country,
            "units_sold": self.units_sold
        }
