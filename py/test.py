import os
from env import openai_api_key
from langchain.llms import OpenAI

# Open API key
os.environ["OPENAI_API_KEY"] = openai_api_key

llm = OpenAI(temperature=0.9)

text = "What would be a good company name for a company that makes colorful socks?"
print(llm(text))
