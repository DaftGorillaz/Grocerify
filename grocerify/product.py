import json

class Product:
    def __init__(self, name, price, price_per_unit, store, size, unit, image_url):
        self.name = name
        self.price = price
        self.price_per_unit = price_per_unit
        self.store = store
        self.size = size
        self.unit = unit
        self.image_url = image_url

    def __str__(self):
        return (f"Product Information:\n"
                f"Name: {self.name}\n"
                f"Price: ${self.price:.2f}\n"
                f"Store: {self.store}\n"
                f"Price per unit: ${self.price_per_unit}\n"
                f"Size: {self.size} {self.unit}\n"
                f"Image URL: {self.image_url}")

    def get_json(self):
        # Return a dictionary that can be serialized to JSON
        return {
            'name': self.name,
            'price': float(self.price) if self.price else 0.00,  # Ensure price is a float
            'price_per_unit': str(self.price_per_unit) if self.price_per_unit else '0.00/unit',  # Ensure price_per_unit is a string
            'retailer': self.store,  # Use retailer instead of store to match frontend expectations
            'package_size': f"{self.size} {self.unit}" if self.size and self.unit else '1 unit',  # Combine size and unit
            'image': self.image_url if self.image_url else 'https://placehold.co/200x200?text=Product'  # Use image instead of image_url
        }