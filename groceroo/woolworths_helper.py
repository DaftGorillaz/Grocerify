import requests
import re
from groceroo.product import Product

class WoolworthsHelper:
    SUPERMARKET_NAME = "woolworths"
    BASE_URL = "https://www.woolworths.com.au/apis/ui/Search/products?searchTerm="

    def search(self, product_string, page_number=1, page_size=36):
        """Search for products on Woolworths."""
        url = f"{self.BASE_URL}{product_string}&pageNumber={page_number}&pageSize={page_size}"
        headers = {"User-Agent": "Mozilla/5.0"}
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return self._create_products(data.get("Products", [])), data.get("SearchResultsCount", 0)
        except requests.RequestException as e:
            print(f"Error fetching data from Woolworths API: {e}")
            return [], 0

    @staticmethod
    def parse_product_size(product_size):
        """Parse the product size string."""
        match = re.match(r"([\d.]+)\s*(g|kg|ml|L|EA)", product_size, re.IGNORECASE)
        if match:
            quantity = float(match.group(1))
            unit = match.group(2).lower()
            if unit in ["kg", "l"]:
                quantity *= 1000
            return int(round(quantity)), unit
        return None, None

    def _create_products(self, json_data):
        """Convert JSON data into Product objects."""
        products = []
        for item in json_data:
            try:
                product_info = item.get("Products", [{}])[0]
                name = item.get("Name", "Unknown Product")
                price = product_info.get("Price")
                if price is None:
                    continue 
                size, unit = self.parse_product_size(product_info.get("CupMeasure", "N/A"))
                image = product_info.get("LargeImageFile", "")
                price_per_unit = round(price / size, 5) if size else None
                products.append(Product(
                    name=name,
                    price=price,
                    store=self.SUPERMARKET_NAME,
                    price_per_unit=price_per_unit,
                    size=size,
                    unit=unit,
                    image_url=image
                ))
            except Exception as e:
                print(f"Error processing product data: {e}")
        return products

    def search_all(self, product_string):
        """Search for all products."""
        all_products = []
        initial_products, total_results = self.search(product_string, page_number=1, page_size=36)
        all_products.extend(initial_products)
        total_pages = (total_results + 35) // 36  # Round up
        for page in range(2, total_pages + 1):
            products, _ = self.search(product_string, page_number=page, page_size=36)
            all_products.extend(products)
        return all_products