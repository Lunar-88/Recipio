from flask import Blueprint, request, jsonify
from sqlalchemy import func, desc, or_
from extensions import db, fs
from models import Recipe, RecipeIngredient, Instruction, Chef, Like, Rating

recipes_bp = Blueprint("recipes", __name__, url_prefix="/api/recipes")


# ------------------
# Create recipe (draft by default)
# ------------------
@recipes_bp.route("", methods=["POST"])
def create_recipe():
    data = request.json
    if not data.get("title") or not data.get("chef_id"):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        recipe = Recipe(
            title=data["title"],
            description=data.get("description", ""),
            chef_id=data["chef_id"],
            cuisine=data.get("cuisine"),
            dietary=data.get("dietary", []),
            cook_time_minutes=data.get("cook_time_minutes"),
            difficulty=data.get("difficulty", "easy"),
            status="draft",
            media_id=data.get("media_id")  # support image
        )
        db.session.add(recipe)
        db.session.commit()

        # Handle ingredients
        for ing in data.get("ingredients", []):
            name = ing.get("ingredient") if isinstance(ing, dict) else str(ing)
            db.session.add(RecipeIngredient(recipe_id=recipe.id, ingredient=name))

        # Handle instructions
        for idx, step in enumerate(data.get("instructions", []), start=1):
            description = step.get("description") if isinstance(step, dict) else str(step)
            db.session.add(Instruction(recipe_id=recipe.id, step_number=idx, description=description))

        db.session.commit()
        return jsonify({"message": "Recipe created", "id": recipe.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ------------------
# Get recipe by ID
# ------------------
@recipes_bp.route("/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify({
        "id": recipe.id,
        "title": recipe.title,
        "description": recipe.description,
        "status": recipe.status,
        "cuisine": recipe.cuisine,
        "dietary": recipe.dietary,
        "cook_time_minutes": recipe.cook_time_minutes,
        "difficulty": recipe.difficulty,
        "ingredients": [i.ingredient for i in recipe.ingredients],
        "instructions": [s.description for s in sorted(recipe.instructions, key=lambda x: x.step_number)],
        "likes_count": len(recipe.likes),
        "avg_rating": (sum(r.stars for r in recipe.ratings)/len(recipe.ratings)) if recipe.ratings else 0,
        "popularity_score": recipe.popularity_score,
        "media_id": recipe.media_id,
        "image_url": f"/api/media/{recipe.media_id}" if recipe.media_id else None
    })


# ------------------
# Update recipe
# ------------------
@recipes_bp.route("/<int:recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    data = request.json

    recipe.title = data.get("title", recipe.title)
    recipe.description = data.get("description", recipe.description)
    recipe.cuisine = data.get("cuisine", recipe.cuisine)
    recipe.dietary = data.get("dietary", recipe.dietary)
    recipe.cook_time_minutes = data.get("cook_time_minutes", recipe.cook_time_minutes)
    recipe.difficulty = data.get("difficulty", recipe.difficulty)
    recipe.media_id = data.get("media_id", recipe.media_id)

    if "ingredients" in data:
        RecipeIngredient.query.filter_by(recipe_id=recipe.id).delete()
        for ing in data["ingredients"]:
            name = ing.get("ingredient") if isinstance(ing, dict) else str(ing)
            db.session.add(RecipeIngredient(recipe_id=recipe.id, ingredient=name))

    if "instructions" in data:
        Instruction.query.filter_by(recipe_id=recipe.id).delete()
        for idx, step in enumerate(data["instructions"], start=1):
            description = step.get("description") if isinstance(step, dict) else str(step)
            db.session.add(Instruction(recipe_id=recipe.id, step_number=idx, description=description))

    db.session.commit()
    return jsonify({"message": "Recipe updated"})


# ------------------
# Delete recipe (full cleanup)
# ------------------
@recipes_bp.route("/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    try:
        # Delete related ingredients and instructions
        RecipeIngredient.query.filter_by(recipe_id=recipe.id).delete()
        Instruction.query.filter_by(recipe_id=recipe.id).delete()

        # Delete likes and ratings
        Like.query.filter_by(recipe_id=recipe.id).delete()
        Rating.query.filter_by(recipe_id=recipe.id).delete()

        # Delete media in GridFS if exists
        if recipe.media_id and fs:
            try:
                fs.delete(recipe.media_id)
            except Exception as e:
                print(f"⚠️ Could not delete media {recipe.media_id}: {e}")

        # Delete recipe itself
        db.session.delete(recipe)
        db.session.commit()
        return jsonify({"message": "Recipe and all associated data deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ------------------
# Publish recipe
# ------------------
@recipes_bp.route("/<int:recipe_id>/publish", methods=["PATCH"])
def publish_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    recipe.status = "published"
    db.session.commit()
    return jsonify({"message": "Recipe published"})


# ------------------
# Search recipes
# ------------------
@recipes_bp.route("/search", methods=["GET"])
def search_recipes():
    q = request.args.get('q')
    ingredients = request.args.get('ingredients')
    chef_name = request.args.get('chef')
    cuisine = request.args.get('cuisine')
    dietary = request.args.get('dietary')
    time_lt = request.args.get('time_lt', type=int)
    difficulty = request.args.get('difficulty')
    sort = request.args.get('sort', 'new')
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)

    query = Recipe.query

    if chef_name:
        query = query.join(Chef).filter(func.lower(Chef.name) == chef_name.lower())

    if q:
        like_q = f"%{q}%"
        query = query.filter(or_(Recipe.title.ilike(like_q), Recipe.description.ilike(like_q)))

    if cuisine:
        query = query.filter(Recipe.cuisine == cuisine)

    if dietary:
        diet_list = [d.strip() for d in dietary.split(',') if d.strip()]
        for d in diet_list:
            query = query.filter(Recipe.dietary.any(d))

    if time_lt:
        query = query.filter(Recipe.cook_time_minutes <= time_lt)

    if difficulty:
        query = query.filter(Recipe.difficulty == difficulty)

    if ingredients:
        ing_list = [i.strip().lower() for i in ingredients.split(',') if i.strip()]
        if ing_list:
            query = query.join(RecipeIngredient).filter(
                func.lower(RecipeIngredient.ingredient).in_(ing_list)
            ).group_by(Recipe.id).having(
                func.count(func.distinct(RecipeIngredient.ingredient)) >= len(ing_list)
            )

    if sort == 'popular':
        query = query.order_by(desc(Recipe.popularity_score))
    elif sort == 'trending':
        query = query.order_by(desc(Recipe.popularity_score), desc(Recipe.created_at))
    else:
        query = query.order_by(desc(Recipe.created_at))

    total = query.count()
    results = query.offset((page-1)*per_page).limit(per_page).all()

    return jsonify({
        "page": page,
        "per_page": per_page,
        "total": total,
        "results": [{
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "chef": r.chef.name if r.chef else None,
            "cuisine": r.cuisine,
            "dietary": r.dietary,
            "cook_time_minutes": r.cook_time_minutes,
            "difficulty": r.difficulty,
            "created_at": r.created_at.isoformat(),
            "media_id": r.media_id,
            "image_url": f"/api/media/{r.media_id}" if r.media_id else None
        } for r in results]
    })
