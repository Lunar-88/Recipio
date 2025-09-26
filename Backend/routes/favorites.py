
from flask import Blueprint, jsonify, request
from extensions import db
from models import Like, Recipe

favorites_bp = Blueprint("favorites", __name__, url_prefix="/api/favorites")

# -------------------------
# Get favorites for a user
# -------------------------
@favorites_bp.route("/<int:user_id>", methods=["GET"])
def get_favorites(user_id):
    favorites = Like.query.filter_by(user_id=user_id).all()
    recipe_ids = [fav.recipe_id for fav in favorites]

    recipes = Recipe.query.filter(Recipe.id.in_(recipe_ids)).all() if recipe_ids else []

    return jsonify({
        "user": user_id,
        "results": [
            {
                "id": r.id,
                "title": r.title,
                "description": r.description
            }
            for r in recipes
        ]
    })


# -------------------------
# Add a favorite
# -------------------------
@favorites_bp.route("/<int:user_id>/<int:recipe_id>", methods=["POST"])
def add_favorite(user_id, recipe_id):
    existing = Like.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if existing:
        return jsonify({"message": "Already in favorites"}), 200

    favorite = Like(user_id=user_id, recipe_id=recipe_id)
    db.session.add(favorite)
    db.session.commit()

    return get_favorites(user_id)  # return full updated list


# -------------------------
# Remove a favorite
# -------------------------
@favorites_bp.route("/<int:user_id>/<int:recipe_id>", methods=["DELETE"])
def remove_favorite(user_id, recipe_id):
    favorite = Like.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return get_favorites(user_id)  # return full updated list
