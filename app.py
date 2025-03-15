from flask import Flask, request, jsonify
import requests
import http.client
import json
import re
import urllib.parse  # Import for encoding spaces
from flask_cors import CORS
from groceroo.helper import Helper
from groceroo.coles_helper import ColesHelper
from groceroo.woolworths_helper import WoolworthsHelper
from groceroo.product import Product

app = Flask(__name__)
CORS(app)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        helper = Helper()
        products = helper.search(query)
        json_products = [product.get_json() for product in products]
        return jsonify(json_products)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
