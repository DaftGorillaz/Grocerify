import json
import requests
from typing import Optional, List, Dict

SIMILARITY_SEARCH_FLOW_ID = "5993123f-28ec-4ae9-afca-8b74e387516d"

class LangFlowProviderConfig():
  def __init__(self,
               similarity_search_flow_id: str):
    self.similarity_search_flow_id = similarity_search_flow_id

class LangFlowProvider():
  def __init__(self,
               config: LangFlowProviderConfig,
               application_token: str,
               base_api_url: str = "https://api.langflow.astra.datastax.com",
               langflow_id: str = "7c6d0acb-34f0-4302-9953-803722048c01"
               ):
    self.config = config
    self.application_token = application_token
    self.base_api_url = base_api_url
    self.langflow_id = langflow_id

  def get_most_relevant_product(self, product_name: str) -> str:
    return self._run_rag_similarity_search_flow(
        product_name=product_name
    )[0]

  def _run_rag_similarity_search_flow(
      self,
      product_name: str,
      output_type: str = "chat",
      input_type: str = "chat"
    ) -> List[str]:
    """
    Run an RAG similarity search flow with a given message

    :param product_name: The product_name we want to search for
    :param endpoint: The ID or the endpoint name of the flow
    :param tweaks: Optional tweaks to customize the flow
    :return: A list of top three most relevant products
    """
    similarity_search_flow_id = self.config.similarity_search_flow_id
    api_url = f"{self.base_api_url}/lf/{self.langflow_id}/api/v1/run/{similarity_search_flow_id}?stream=false"

    payload = {
        "input_value": product_name,
        "output_type": output_type,
        "input_type": input_type,
    }
    headers = None
    if self.application_token:
        headers = {"Authorization": "Bearer " + self.application_token, "Content-Type": "application/json"}

    try:
      response = requests.post(api_url, json=payload, headers=headers).json()
      message = json.loads(response["outputs"][0]["outputs"][0]["results"]["message"]["data"]["text"])
      return message
    except Exception as e:
      print(e)
      return []
    