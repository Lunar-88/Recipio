
from flask import Blueprint, request, jsonify
from app import db
from models import Recipe, Like, Rating

engagement_bp = Blueprint("engagement", __name__, url_prefix="/api/recipes")

# Mock user ID (replace with real auth later)
def get_current_user_id():
    return 1  # hardcoded for now


# Like/unlike recipe
@engagement_bp.route("/<int:recipe_id>/like", methods=["POST"])
def toggle_like(recipe_id):
    user_id = get_current_user_id()
    recipe = Recipe.query.get_or_404(recipe_id)

    like = Like.query.filter_by(recipe_id=recipe.id, user_id=user_id).first()
    if like:
        db.session.delete(like)
        message = "Unliked"
    else:
        like = Like(recipe_id=recipe.id, user_id=user_id)
        db.session.add(like)
        message = "Liked"
    
    db.session.commit()
    recipe.update_popularity()
    return jsonify({"message": message, "likes_count": recipe.likes_count()})


# Rate recipe
@engagement_bp.route("/<int:recipe_id>/rate", methods=["POST"])
def rate_recipe(recipe_id):
    user_id = get_current_user_id()
    recipe = Recipe.query.get_or_404(recipe_id)
    data = request.json
    stars = data.get("stars")

    if not stars or stars < 1 or stars > 5:
        return jsonify({"error": "Stars must be 1-5"}), 400

    rating = Rating.query.filter_by(recipe_id=recipe.id, user_id=user_id).first()
    if rating:
        rating.stars = stars
    else:
        rating = Rating(recipe_id=recipe.id, user_id=user_id, stars=stars)
        db.session.add(rating)

    db.session.commit()
    recipe.update_popularity()
    return jsonify({"message": "Rating submitted", "avg_rating": recipe.avg_rating()})


# Get engagement stats
@engagement_bp.route("/<int:recipe_id>/engagement", methods=["GET"])
def engagement_stats(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify({
        "likes_count": recipe.likes_count(),
        "avg_rating": recipe.avg_rating(),
        "popularity_score": recipe.popularity_score
    })
