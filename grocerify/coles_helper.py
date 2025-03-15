import requests
import re
from grocerify.product import Product
from typing import Tuple

class ColesHelper:
    BASE_URL = "https://coles-product-price-api.p.rapidapi.com"
    HEADERS = {
        'x-rapidapi-key': "2069c0eb29msh42ff827d1be8e8cp122688jsnbe5bb985a599",
        'x-rapidapi-host': "coles-product-price-api.p.rapidapi.com"
    }
    ENDPOINT = "/coles/product-search/"

    @classmethod
    def search(cls, query, page=1, size=20):
        """Fetch products for a specific query from the Coles API."""
        encoded_query = requests.utils.quote(query)
        url = f"{cls.BASE_URL}{cls.ENDPOINT}?query={encoded_query}&size={size}&page={page}"

        try:
            response = requests.get(url, headers=cls.HEADERS)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching data from Coles API: {e}")
            return {}

    @staticmethod
    def parse_product_size(product_size) -> Tuple[int | None, str | None]:
        """Parse the product size string into a numerical value and unit."""
        if product_size == None:
            return None, None
        match = re.match(r"([\d.]+)\s*(g|kg|ml|L|EA)", product_size, re.IGNORECASE)
        if match:
            quantity = float(match.group(1))
            unit = match.group(2).lower()
            if unit in ["kg", "l"]:
                quantity *= 1000
            return int(round(quantity)), unit
        return None, None

    @staticmethod
    def extract_product_code(url):
        """Extract the product code from the URL."""
        match = re.search(r"/(\d+)$", url)
        return match.group(1) if match else None

    @staticmethod
    def build_image_url(product_code):
        """Build the image URL using the product code."""
        return f"https://cdn.productimages.coles.com.au/productimages/{product_code[0]}/{product_code}.jpg" if product_code else ""

    @classmethod
    def _create_products(cls, raw_products):
        """Convert raw product data into Product instances."""
        products = []
        for product in raw_products:
            price = float(product.get("current_price", 0.0))
            size, unit = cls.parse_product_size(product.get("product_size", ""))

            # Some product does not have price per unit. If that is the case,
            # just skip the product.
            if size is None:
                continue
            
            price_per_unit = round(price / size, 5) if size and size > 0 else None
            product_code = cls.extract_product_code(product.get("url", ""))
            image_url = cls.build_image_url(product_code)
            products.append(Product(
                name=product.get("product_name", "Unknown Product"),
                price=price,
                price_per_unit=price_per_unit,
                store="coles",
                size=size,
                unit=unit,
                image_url=image_url
            ))
        return products

    @classmethod
    def search_all(cls, query):
        """Fetch all products across multiple pages."""
        first_page_data = cls.search(query, page=1)
        if not first_page_data or "results" not in first_page_data:
            return []

        total_pages = int(first_page_data.get("total_pages", 1))
        all_results = first_page_data["results"]

        for page in range(2, total_pages + 1):
            page_data = cls.search(query, page=page)
            if page_data and "results" in page_data:
                all_results.extend(page_data["results"])

        return cls._create_products(all_results)