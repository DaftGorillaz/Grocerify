from groceroo import coles_helper, woolworths_helper
from groceroo.product import Product

class Helper:
    def __init__(self):
        self.wh = woolworths_helper.WoolworthsHelper()
        self.ch = coles_helper.ColesHelper()

    def search(self, product_str):
        """Search for a product in both supermarkets."""
        return self.wh.search_all(product_str) + self.ch.search_all(product_str)
    
    def search_by_product_and_store(self, product_str: str, store: str) -> Product | None:
        product: Product | None
        if store == "coles":
            product = self.ch.search_one(query=product_str)
        else:
            product = self.wh.search_one(product_string=product_str)

        return product