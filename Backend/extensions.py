from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient, errors
import gridfs
import os

db = SQLAlchemy()

# Globals for Mongo
mongo_client = None
mongo_db = None
fs = None

def init_mongo(app):
    """
    Initialize MongoDB + GridFS with connection check
    """
    global mongo_client, mongo_db, fs
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db_name = os.getenv("MONGO_DB", "recipio")

    try:
        mongo_client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        mongo_db = mongo_client[mongo_db_name]
        fs = gridfs.GridFS(mongo_db)

        # ✅ Test connection
        mongo_client.admin.command("ping")
        print(f"✅ Connected to MongoDB database: {mongo_db.name}")
        return mongo_client, mongo_db, fs  # <- return objects

    except errors.ServerSelectionTimeoutError as e:
        print("❌ Could not connect to MongoDB:", str(e))
        mongo_client = None
        mongo_db = None
        fs = None
        return mongo_client, mongo_db, fs


