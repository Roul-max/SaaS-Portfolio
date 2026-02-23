from pymongo import MongoClient
from .config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["portfolio_ai"]
chat_collection = db["chat_logs"]