from flask import Flask, request, jsonify
import requests
import http.client
import json
import re
import urllib.parse  # Import for encoding spaces
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# API Configurations
SUPERMARKETS = {
    "woolworths": {
        "base_url": "woolworths-products-api.p.rapidapi.com",
        "headers": {
            'x-rapidapi-key': "2069c0eb29msh42ff827d1be8e8cp122688jsnbe5bb985a599",
            'x-rapidapi-host': "woolworths-products-api.p.rapidapi.com"
        },
        "endpoint": "/woolworths/product-search/"
    },
    "coles": {
        "base_url": "coles-product-price-api.p.rapidapi.com",
        "headers": {
            'x-rapidapi-key': "2069c0eb29msh42ff827d1be8e8cp122688jsnbe5bb985a599",
            'x-rapidapi-host': "coles-product-price-api.p.rapidapi.com"
        },
        "endpoint": "/coles/product-search/"
    }
}

def fetch_products(supermarket, query, page=1, size=20):
    """
    Fetch product search results from the selected supermarket API.

    :param supermarket: The supermarket to search (woolworths or coles).
    :param query: The search query string.
    :param page: The page number to fetch.
    :param size: The number of results per page.
    :return: JSON response as a dictionary or None if an error occurs.
    """
    if supermarket not in SUPERMARKETS:
        print(f"Error: Supermarket '{supermarket}' is not supported.")
        return None

    config = SUPERMARKETS[supermarket]
    conn = http.client.HTTPSConnection(config["base_url"])

    # Encode the product name (spaces -> %20)
    encoded_query = urllib.parse.quote(query)
    endpoint = f"{config['endpoint']}?query={encoded_query}&size={size}&page={page}"

    try:
        conn.request("GET", endpoint, headers=config["headers"])
        res = conn.getresponse()

        if res.status != 200:
            print(f"Error: Request failed with status code {res.status}")
            return None

        data = res.read()
        return json.loads(data.decode("utf-8"))

    except json.JSONDecodeError:
        print("Error: Failed to parse JSON response.")
        return None

    finally:
        conn.close()

def parse_product_size(product_size):
    """
    Extract numerical value and unit from product_size and convert to a standard unit.

    :param product_size: The size of the product (e.g., '500g', '1L', '250ml').
    :return: Converted size in grams (for weight) or milliliters (for volume).
    """
    match = re.match(r"([\d.]+)\s*(g|kg|ml|L)", product_size, re.IGNORECASE)

    if match:
        quantity = float(match.group(1))
        unit = match.group(2).lower()

        # Convert to base units: grams for weight, milliliters for volume
        if unit == "kg":
            quantity *= 1000  # Convert kg to g
        elif unit == "l":
            quantity *= 1000  # Convert L to ml

        return quantity
    return None

def get_all_products(supermarket, query):
    """
    Fetch all products for a given query from the selected supermarket.

    :param supermarket: The supermarket to search (woolworths or coles).
    :param query: The search query string.
    :return: List of all products found with price_per_unit added where applicable.
    """
    first_page_data = fetch_products(supermarket, query, page=1)

    if not first_page_data or "results" not in first_page_data:
        print(f"Error: No results found for '{query}' in {supermarket}.")
        return []

    total_pages = int(first_page_data.get("total_pages", 1))
    total_results = int(first_page_data.get("total_results", 0))

    print(f"Supermarket: {supermarket.capitalize()}")
    print(f"Search Query: {query}")
    print(f"Total Results: {total_results}")
    print(f"Total Pages: {total_pages}")

    all_results = first_page_data["results"]

    # Fetch remaining pages
    for page in range(2, total_pages + 1):
        print(f"Fetching page {page} from {supermarket}...")
        page_data = fetch_products(supermarket, query, page=page)

        if page_data and "results" in page_data:
            all_results.extend(page_data["results"])
        else:
            print(f"Warning: No results found on page {page}.")

    # Process results to add price_per_unit
    for product in all_results:
        if "product_size" in product and "current_price" in product:
            size = parse_product_size(product["product_size"])
            price = product.get("current_price")

            if size and price and size > 0:
                product["price_per_unit"] = round(price / size, 5)  # Price per gram or ml

    print(f"Total products collected from {supermarket}: {len(all_results)}")
    return all_results

@app.route('/search', methods=['GET'])
def search():
    supermarket = request.args.get('supermarket')
    query = request.args.get('query')

    if not supermarket or not query:
        return jsonify({"error": "Missing supermarket or query"}), 400

    data = fetch_products(supermarket, query)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
