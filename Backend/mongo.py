
from pymongo import MongoClient
from gridfs import GridFS
import os

client = MongoClient(os.getenv("MONGO_URI"))
mongo_db = client[os.getenv("MONGO_DB", "recipio")]
fs = GridFS(mongo_db)
