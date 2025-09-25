
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

from extensions import db  # import once at the top

# ---------------------
# Load environment
# ---------------------
load_dotenv()

def create_app():
    app = Flask(__name__)

    # ---------------------
    # CORS
    # ---------------------
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"]
        }
    })

    # ---------------------
    # Config
    # ---------------------
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
       'DATABASE_URL', 'sqlite:///recipio.db'
    )

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Optional AWS Config
    app.config['AWS_REGION'] = os.getenv('AWS_REGION')
    app.config['S3_BUCKET'] = os.getenv('S3_BUCKET')

    # ---------------------
    # Initialize extensions
    # ---------------------
    db.init_app(app)
    Migrate(app, db)

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
    from routes.media import media_bp

    app.register_blueprint(recipes_bp, url_prefix="/api/recipes")
    app.register_blueprint(engagement_bp, url_prefix="/api/engagement")
    app.register_blueprint(favorites_bp, url_prefix="/api/favorites")
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
