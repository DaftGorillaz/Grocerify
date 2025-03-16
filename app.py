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
from groceroo.langflow_provider import LangFlowProviderConfig, LangFlowProvider
import concurrent.futures
from typing import Dict, List, Tuple, Any

app = Flask(__name__)
CORS(app)

# Initialize Langflow Connection
langflow_provider_config = LangFlowProviderConfig(
    similarity_search_flow_id="5993123f-28ec-4ae9-afca-8b74e387516d"
)
langflow_provider = LangFlowProvider(
    config=langflow_provider_config,
    application_token=""
)

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

@app.route('/recommendation', methods=['GET'])
def get_recommendations():
    """
    API endpoint that receives a list of product names in the request body
    and processes them.
    
    Expected JSON format:
    {
        "products": ["Product Name 1", "Product Name 2", "Product Name 3"]
    }
    
    Returns:
        JSON response with processed products or error message
    """
    try:
        # Get JSON data from request body
        query = request.args.get('query')
        
        # Validate input
        # if not data or 'products' not in data:
        #     return jsonify({
        #         'error': 'Invalid request format. Expected JSON with "products" list'
        #     }), 400
            
        product_names = [query]
        
        # Validate that products is a list
        if not isinstance(product_names, list):
            return jsonify({
                'error': 'The "products" field must be a list of product names'
            }), 400
            
        # Validate that the list is not empty
        if len(product_names) == 0:
            return jsonify({
                'error': 'The product list cannot be empty'
            }), 400
            
        # Process the product names (example implementation)
        helper = Helper()
        recommendations = []
        for name in product_names:
            ### DO PROCESSING HERE ###
            relevant_product_tuples = langflow_provider.get_most_relevant_products(product_name=name)
            relevant_products = []

            for product_name, store in relevant_product_tuples:
                product = helper.search_by_product_and_store(product_str=product_name, store=store)
                
                if product is None:
                    print(f"Problem searching for {product_name} from {store}")
                    continue
                relevant_products.append(product)

            recommendations.append({
                name: [relevant_product.get_json() for relevant_product in relevant_products],
            })
            
        # Return the processed products
        return jsonify([relevant_product.get_json() for relevant_product in relevant_products])
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error processing products batch: {str(e)}")
        
        # Return error response
        return jsonify({
            'error': 'An error occurred while processing the request',
            'message': str(e)
        }), 500
    
@app.route('/recommendation-concurrent', methods=['POST'])
def get_recommendations_concurrent():
    """
    API endpoint that receives a list of product names in the request body
    and processes them.
    
    Expected JSON format:
    {
        "products": ["Product Name 1", "Product Name 2", "Product Name 3"]
    }
    
    Returns:
        JSON response with processed products or error message
    """
    try:
        # Get JSON data from request body
        data = request.get_json()
        
        # Validate input
        if not data or 'products' not in data:
            return jsonify({
                'error': 'Invalid request format. Expected JSON with "products" list'
            }), 400
            
        product_names = data['products']
        
        # Validate that products is a list
        if not isinstance(product_names, list):
            return jsonify({
                'error': 'The "products" field must be a list of product names'
            }), 400
            
        # Validate that the list is not empty
        if len(product_names) == 0:
            return jsonify({
                'error': 'The product list cannot be empty'
            }), 400
            
        # Process the product names (example implementation)
        recommendations = []
        # Process all product names concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            # Submit all product name processing tasks
            future_to_name = {executor.submit(process_product, name): name for name in product_names}
            
            # Collect results as they complete
            for future in concurrent.futures.as_completed(future_to_name):
                name = future_to_name[future]
                try:
                    result = future.result()
                    recommendations.append(result)
                except Exception as e:
                    print(f"Error retrieving result for {name}: {str(e)}")
                    recommendations.append({name: []})
            
        # Return the processed products
        return recommendations
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error processing products batch: {str(e)}")
        
        # Return error response
        return jsonify({
            'error': 'An error occurred while processing the request',
            'message': str(e)
        }), 500
    
# Define a function to process a single product name
def process_product(name: str) -> Dict[str, List[Dict[str, Any]]]:
    helper = Helper()
    try:
        relevant_product_tuples = langflow_provider.get_most_relevant_products(product_name=name)
        relevant_products = []

        # Define a nested function to process each product tuple
        def process_product_tuple(product_tuple: Tuple[str, str]) -> Any:
            product_name, store = product_tuple
            return helper.search_by_product_and_store(product_str=product_name, store=store)
        
        # Process product tuples concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as inner_executor:
            # Submit all product tuple processing tasks
            future_to_tuple = {
                inner_executor.submit(process_product_tuple, product_tuple): product_tuple 
                for product_tuple in relevant_product_tuples
            }
            
            # Collect results as they complete
            for future in concurrent.futures.as_completed(future_to_tuple):
                product_tuple = future_to_tuple[future]
                try:
                    product = future.result()
                    if product is not None:
                        relevant_products.append(product)
                    else:
                        product_name, store = product_tuple
                        print(f"Problem searching for {product_name} from {store}")
                except Exception as e:
                    product_name, store = product_tuple
                    print(f"Error processing {product_name} from {store}: {str(e)}")
        
        return {name: [relevant_product.__dict__ for relevant_product in relevant_products]}
    except Exception as e:
        print(f"Error processing product name {name}: {str(e)}")
        return {name: []}

if __name__ == '__main__':
    app.run(debug=True)
