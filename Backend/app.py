# app.py

from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

import cloudinary  # 💡 Import Cloudinary
from extensions import db, init_mongo

# ---------------------
# Load environment
# ---------------------
load_dotenv()


def create_app():
    app = Flask(__name__)

    # ---------------------
    # CORS (allow local dev origins)
    # ---------------------
    CORS(
        app,
        resources={r"/api/*": {"origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
        ]}},
        supports_credentials=True
    )

    # ---------------------
    # Config
    # ---------------------
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///recipio.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Optional AWS Config (Kept but not used for current image solution)
    app.config["AWS_REGION"] = os.getenv("AWS_REGION")
    app.config["S3_BUCKET"] = os.getenv("S3_BUCKET")

    # 💡 Cloudinary Configuration
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )

    # ---------------------
    # Initialize extensions
    # ---------------------
    db.init_app(app)
    Migrate(app, db)

    # ✅ Initialize MongoDB
    init_mongo(app)

    # ---------------------
    # Import models AFTER db is ready
    # ---------------------
    from models import Chef, Recipe, RecipeIngredient, Instruction, Media, Like, Rating

    # ---------------------
    # Register Blueprints
    # ---------------------
    from routes.recipes import recipes_bp
    from routes.engagement import engagement_bp
    from routes.favorites import favorites_bp
    
    # 💡 CORRECTED IMPORT: Import the consistently named blueprint object
    from routes.media import media_bp 

    app.register_blueprint(recipes_bp, url_prefix="/api/recipes")
    app.register_blueprint(engagement_bp, url_prefix="/api/engagement")
    app.register_blueprint(favorites_bp, url_prefix="/api/favorites")
    
    # 💡 Register the media blueprint at /api/media
    app.register_blueprint(media_bp, url_prefix="/api/media")

    # ---------------------
    # Root route
    # ---------------------
    @app.route("/")
    def index():
        return {"message": "Recipio API is running."}

    return app


# ---------------------
# Run server
# ---------------------
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)