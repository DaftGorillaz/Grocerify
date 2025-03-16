from astrapy import DataAPIClient
from typing import Literal, List, Optional
from grocerify.product import Product
import os

class ProductVectorDBProviderConfig():
  def __init__(self,
               astra_db_application_token: Optional[str] = None,
               astra_db_api_endpoint: Optional[str] = None,
               astra_db_collection_name: Optional[str] = None):
    # Use provided values or fall back to environment variables
    self.application_token = astra_db_application_token or os.environ.get("ASTRA_DB_APPLICATION_TOKEN")
    self.api_endpoint = astra_db_api_endpoint or os.environ.get("ASTRA_DB_API_ENDPOINT")
    self.collection_name = astra_db_collection_name or os.environ.get("ASTRA_DB_COLLECTION")

  def validate(self) -> None:
    """Validate that all required configuration values are present."""
    missing = []
    
    if not self.application_token:
        missing.append("ASTRA_DB_APPLICATION_TOKEN")
    if not self.api_endpoint:
        missing.append("ASTRA_DB_API_ENDPOINT")
    if not self.collection_name:
        missing.append("ASTRA_DB_COLLECTION")
        
    if missing:
        raise ValueError(f"Missing required configuration: {', '.join(missing)}")
    
  @classmethod
  def from_env(cls) -> 'ProductVectorDBProviderConfig':
      """
      Create a configuration instance from environment variables.
      
      Returns:
          ProductVectorDBProviderConfig: Configured instance
      """
      return cls()

class ProductVectorDBProvider():
  def __init__(self,
               config: ProductVectorDBProviderConfig):
    """
    Arguments:
      config (ProductVectorDBProviderConfig): Config object to connect to the database
    """

    # Connect to Astra DB
    client = DataAPIClient(config.application_token)
    database = client.get_database(config.api_endpoint)
    self.collection = database.get_collection(config.collection_name)

  def insert_product(self,
                     product_name: str,
                     source: Literal["coles", "woolworths"]) -> bool:
    """A function for inserting a product into the vector DB

    Arguments:
      product_name (str): The product name we want to insert
      source (str): The source of the product (can only be "coles" or "woolworths")
    Returns:
      bool: True if the insertion is successful. Otherwise, returns False
    """
    # Combine relevant fields into a single string to be vectorized
    content = product_name

    try:
      truncated_content = self._truncate_content(content)
      self.collection.insert_one(
        document={
          'content': truncated_content,
          '$vectorize': truncated_content,
          'metadata': {
            "product_name": product_name,
            "source": source
          }
        }
      )
      return True
    except Exception as ex:
      print(ex)
      return False
    
  def insert_products(self,
                      products: List[Product]):
    """A function for inserting multiple products

    Arguments:
      products: A list of tuples consisting of product name and the store
    """
    try:
      # For Astra DB, we need to handle each document individually for upserts
      updated_count = 0
      inserted_count = 0

      for product in products:
        product_id = product.name.replace(' ', '')
        
        # Check if the document exists
        existing_doc = self.collection.find_one({'_id': product_id})
        
        if existing_doc:
          # Update existing document
          result = self.collection.update_one(
              filter={'_id': product_id},
              update={
                '$set': {
                  'content': product.name,
                  '$vectorize': product.name,
                  'metadata': product.__dict__
                }
              }
          )
          if result.update_info["n"] > 0:
            updated_count += 1
        else:
          # Insert new document
          self.collection.insert_one({
            '_id': product_id,
            'content': product.name,
            '$vectorize': product.name,
            'metadata': product.__dict__
          })
          inserted_count += 1

      # self.collection.insert_many(
      #     documents=[
      #         {
      #           '_id': product.name.replace(' ', ''),
      #           'content': f"product.name",
      #           '$vectorize': product.name,
      #           'metadata': product.__dict__
      #         } for product in products
      #     ]
      # )

    except Exception as ex:
      print(ex)

  def get_products_by_similarity(self,
                                 product_name: str,
                                 limit: int = 5) -> List[str]:
    """A function for retrieving product names based on similarity.

    Arguments:
      product_name (str): The product name from which we will retrieve similar products.
      limit (Optional[int]): Limit of how many products to retrieve.
    Returns:
      List[str]: A list of similar product names.
    """
    # Retrieve data from Astra DB
    try:
      result = self.collection.find(
        {},
        sort={"$vectorize": product_name},
        limit=limit
      )

      # Convert cursor to a list of documents
      all_docs = list(result)

      # Extract the product names and return them
      return [doc.get('metadata', {}).get('product_name', 'N/A') for doc in all_docs]

    except Exception as ex:
      print(f"Error retrieving products by similarity. Error: {ex}")
      return []


  def _truncate_content(self, content: str, max_bytes=512) -> str:
    """A function for truncating content so the string does not overflow.
    The max_bytes=512 for Nvidia NV-Embed-QA embedding model.

    Arguments:
        content (str): The string to be truncated
        max_bytes (int): Maximum byte size
    Returns:
        str: The truncated content
    """
    # Encode the string into bytes (UTF-8 encoding)
    content_bytes = content.encode('utf-8')

    # Check if the byte length exceeds the limit
    if len(content_bytes) > max_bytes:
      # Truncate the content to the maximum byte size
      truncated_content_bytes = content_bytes[:max_bytes]

      # Decode back to a string, ensuring no decoding errors occur
      truncated_content = truncated_content_bytes.decode('utf-8', errors='ignore')
    else:
      truncated_content = content

    return truncated_content
  