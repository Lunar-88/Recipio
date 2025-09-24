
from flask import Blueprint, request, jsonify
from app import db
from models import Recipe, RecipeIngredient, Instruction

recipes_bp = Blueprint("recipes", __name__, url_prefix="/api/recipes")

# ------------------
# CRUD for Recipes
# ------------------

# Create recipe (draft by default)
@recipes_bp.route("", methods=["POST"])
def create_recipe():
    data = request.json
    recipe = Recipe(
        title=data["title"],
        description=data.get("description", ""),
        chef_id=data["chef_id"],
        cuisine=data.get("cuisine"),
        dietary=data.get("dietary", []),
        cook_time_minutes=data.get("cook_time_minutes"),
        difficulty=data.get("difficulty", "easy"),
        status="draft"
    )
    db.session.add(recipe)
    db.session.commit()

    # Add ingredients
    for ing in data.get("ingredients", []):
        db.session.add(RecipeIngredient(recipe_id=recipe.id, ingredient=ing))
    
    # Add instructions
    for idx, step in enumerate(data.get("instructions", []), start=1):
        db.session.add(Instruction(recipe_id=recipe.id, step_number=idx, description=step))
    
    db.session.commit()
    return jsonify({"message": "Recipe created", "id": recipe.id}), 201


# Get recipe by ID
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
        "likes_count": recipe.likes_count(),
        "avg_rating": recipe.avg_rating(),
        "popularity_score": recipe.popularity_score
    })


# Update recipe
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

    # Replace ingredients
    if "ingredients" in data:
        RecipeIngredient.query.filter_by(recipe_id=recipe.id).delete()
        for ing in data["ingredients"]:
            db.session.add(RecipeIngredient(recipe_id=recipe.id, ingredient=ing))
    
    # Replace instructions
    if "instructions" in data:
        Instruction.query.filter_by(recipe_id=recipe.id).delete()
        for idx, step in enumerate(data["instructions"], start=1):
            db.session.add(Instruction(recipe_id=recipe.id, step_number=idx, description=step))

    db.session.commit()
    return jsonify({"message": "Recipe updated"})


# Delete recipe
@recipes_bp.route("/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"message": "Recipe deleted"})


# Publish recipe
@recipes_bp.route("/<int:recipe_id>/publish", methods=["PATCH"])
def publish_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    recipe.status = "published"
    db.session.commit()
    return jsonify({"message": "Recipe published"})
