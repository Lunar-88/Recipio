from app import create_app
from extensions import init_mongo

# Initialize Flask app
app = create_app()

# Initialize MongoDB
mongo_client, mongo_db, fs = init_mongo(app)

# Now mongo_db is valid
mongo_db.recipes.drop()
mongo_db.recipeingredients.drop()
mongo_db.instructions.drop()
mongo_db.likes.drop()
mongo_db.ratings.drop()

print("✅ All recipes cleared from local MongoDB.")
