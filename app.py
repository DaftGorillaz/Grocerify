from flask import Flask, request, jsonify
import requests
import http.client
import json
import re
import urllib.parse  # Import for encoding spaces
from flask_cors import CORS
from grocerify.helper import Helper
from grocerify.coles_helper import ColesHelper
from grocerify.woolworths_helper import WoolworthsHelper
from grocerify.product import Product

app = Flask(__name__)
CORS(app)

@app.route('/search', methods=['GET'])
def search():

    query = request.args.get('query')

    helper = Helper()
    products = helper.search(query)
    json_products = []
    i = 0
    for product in products:
        json_products.append(product.get_json())
    return json_products

if __name__ == '__main__':
    app.run(debug=True)
