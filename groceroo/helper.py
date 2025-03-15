from groceroo import coles_helper, woolworths_helper
from groceroo.product import Product

class Helper:
    def __init__(self):
        self.wh = woolworths_helper.WoolworthsHelper()
        self.ch = coles_helper.ColesHelper()

    def search(self, product_str):
        """Search for a product in both supermarkets."""
        return self.wh.search_all(product_str) + self.ch.search_all(product_str)