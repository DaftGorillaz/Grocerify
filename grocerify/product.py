class Product:
    def __init__(self, name, price, price_per_unit, store, size, unit, image_url):
        self.name = name
        self.price = price  # Removed the comma
        self.price_per_unit = price_per_unit
        self.store = store
        self.size = size
        self.unit = unit
        self.image_url = image_url  # Renamed for clarity

    def __str__(self):
        return (f"Product Information:\n"
                f"Name: {self.name}\n"
                f"Price: ${self.price:.2f}\n"
                f"Supermarket: {self.store}\n"
                f"Price per unit: ${self.price_per_unit}\n"
                f"Size: {self.size} {self.unit}\n"
                f"Image URL: {self.image_url}")

    # Getters
    def get_name(self):
        return self.name

    def get_price(self):
        return self.price

    def get_store(self):
        return self.store

    def get_size(self):
        return self.size

    def get_unit(self):
        return self.unit

    def get_image_url(self):
        return self.image_url

    def get_price_per_unit(self):
        return self.price_per_unit
