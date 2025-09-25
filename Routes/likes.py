# routes/likes.py
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Like, Recipe
from flask_jwt_extended import jwt_required, get_jwt_identity

likes_bp = Blueprint("likes", __name__, url_prefix="/likes")

@likes_bp.route("", methods=["POST"])
@jwt_required()
def like_recipe():
    """
    Toggle a like for a recipe.
    Request JSON: { "recipe_id": <int> }
    Returns 201 with created like or 200 if unliked.
    """
    data = request.get_json() or {}
    recipe_id = data.get("recipe_id")
    if not recipe_id:
        return jsonify({"msg": "recipe_id required"}), 400

    user_id = get_jwt_identity()

    # optional: ensure the recipe exists
    # recipe = Recipe.query.get(recipe_id)
    # if not recipe:
    #     return jsonify({"msg": "recipe not found"}), 404

    existing = Like.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"msg": "unliked"}), 200

    like = Like(user_id=user_id, recipe_id=recipe_id)
    db.session.add(like)
    db.session.commit()
    return jsonify({"id": like.id, "recipe_id": like.recipe_id}), 201

@likes_bp.route("/<int:like_id>", methods=["DELETE"])
@jwt_required()
def remove_like(like_id):
    user_id = get_jwt_identity()
    like = Like.query.get_or_404(like_id)
    if like.user_id != user_id:
        return jsonify({"msg": "forbidden"}), 403
    db.session.delete(like)
    db.session.commit()
    return jsonify({"msg": "removed"}), 200

@likes_bp.route("/<int:recipe_id>", methods=["GET"])
def get_likes_for_recipe(recipe_id):
    """
    Public endpoint that returns likes for a recipe.
    You can extend this to include a 'count' or user list as needed.
    """
    likes = Like.query.filter_by(recipe_id=recipe_id).all()
    out = [{"id": l.id, "user_id": l.user_id, "created_at": l.created_at.isoformat()} for l in likes]
    return jsonify({"count": len(out), "likes": out}), 200
