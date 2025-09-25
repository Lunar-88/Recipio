
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
import gridfs
import os

db = SQLAlchemy()

# Globals for Mongo
mongo_client = None
mongo_db = None
fs = None

def init_mongo(app):
    """
    Initialize MongoDB + GridFS
    """
    global mongo_client, mongo_db, fs
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/recipio")
    mongo_client = MongoClient(mongo_uri)
    # If using Atlas, MONGO_URI should include the db name at the end
    mongo_db = mongo_client.get_default_database()
    fs = gridfs.GridFS(mongo_db)

