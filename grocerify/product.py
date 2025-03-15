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
        return json.dumps({
            'name': self.name,
            'price': self.price,
            'price_per_unit': self.price_per_unit,
            'store': self.store,
            'size': self.size,
            'unit': self.unit,
            'image_url': self.image_url
        })