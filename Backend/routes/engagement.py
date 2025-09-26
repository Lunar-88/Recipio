
from flask import Blueprint, request, jsonify
from extensions import db                # ✅ import db here
from models import Like, Rating, Recipe  # keep models import

engagement_bp = Blueprint("engagement", __name__, url_prefix="/api/engagement")

# -------------------------
# Like a recipe
# -------------------------
@engagement_bp.route("/likes/<int:recipe_id>", methods=["POST"])
def like_recipe(recipe_id):
    data = request.json or {}
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    like = Like(recipe_id=recipe_id, user_id=user_id)
    db.session.add(like)
    db.session.commit()

    # Update recipe popularity if method exists
    recipe = Recipe.query.get(recipe_id)
    if recipe and hasattr(recipe, "update_popularity"):
        recipe.update_popularity()
        db.session.commit()

    return jsonify({"message": "Liked!"})


# -------------------------
# Rate a recipe
# -------------------------
@engagement_bp.route("/ratings/<int:recipe_id>", methods=["POST"])
def rate_recipe(recipe_id):
    data = request.json or {}
    user_id = data.get("user_id")
    stars = data.get("stars")

    if not user_id or stars is None:
        return jsonify({"error": "Missing fields"}), 400

    rating = Rating(recipe_id=recipe_id, user_id=user_id, stars=stars)
    db.session.add(rating)
    db.session.commit()

    # Update recipe popularity if method exists
    recipe = Recipe.query.get(recipe_id)
    if recipe and hasattr(recipe, "update_popularity"):
        recipe.update_popularity()
        db.session.commit()

    return jsonify({"message": "Rated!"})

