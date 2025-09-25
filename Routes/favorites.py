# routes/favorites.py
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Favorite, User, Recipe
from flask_jwt_extended import jwt_required, get_jwt_identity

favorites_bp = Blueprint("favorites", __name__, url_prefix="/favorites")

@favorites_bp.route("", methods=["POST"])
@jwt_required()
def add_favorite():
    data = request.get_json() or {}
    recipe_id = data.get("recipe_id")
    if not recipe_id:
        return jsonify({"msg": "recipe_id required"}), 400

    user_id = get_jwt_identity()

    # optional check that the recipe exists (if Recipe model is available)
    recipe = Recipe.query.get(recipe_id) if hasattr(Recipe, "query") else None
    if recipe is None and Recipe.query is not None:
        # If your project stores recipes elsewhere, skip this check or adapt it.
        pass

    # prevent duplicate favorites (UniqueConstraint should exist on user_id+recipe_id)
    exists = Favorite.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if exists:
        return jsonify({"msg": "already favorited"}), 409

    fav = Favorite(user_id=user_id, recipe_id=recipe_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({"id": fav.id, "recipe_id": fav.recipe_id}), 201

@favorites_bp.route("/<int:fav_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(fav_id):
    user_id = get_jwt_identity()
    fav = Favorite.query.get_or_404(fav_id)
    if fav.user_id != user_id:
        return jsonify({"msg": "forbidden"}), 403
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"msg": "removed"}), 200

@favorites_bp.route("/<int:user_id>", methods=["GET"])
def list_favorites(user_id):
    # public endpoint: list all favorites for given user id
    favs = Favorite.query.filter_by(user_id=user_id).all()
    out = [{"id": f.id, "recipe_id": f.recipe_id, "created_at": f.created_at.isoformat()} for f in favs]
    return jsonify(out), 200
