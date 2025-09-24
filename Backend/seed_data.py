from app import app, db, Chef, Recipe, RecipeIngredient

def seed_database():
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Add sample chefs
        chef1 = Chef(name="Gordon Ramsay")
        chef2 = Chef(name="Julia Child")
        db.session.add_all([chef1, chef2])
        db.session.commit()
        
        # Add sample recipes
        recipe1 = Recipe(
            title="Spaghetti Carbonara",
            description="Classic Italian pasta dish",
            chef_id=chef1.id,
            cuisine="Italian",
            dietary=["vegetarian"],
            cook_time_minutes=30,
            difficulty="medium",
            popularity_score=95
        )
        
        recipe2 = Recipe(
            title="Beef Wellington",
            description="Tender beef wrapped in pastry",
            chef_id=chef1.id,
            cuisine="British",
            dietary=[],
            cook_time_minutes=120,
            difficulty="hard",
            popularity_score=88
        )
        
        db.session.add_all([recipe1, recipe2])
        db.session.commit()
        
        # Add ingredients
        ingredients1 = [
            RecipeIngredient(recipe_id=recipe1.id, ingredient="spaghetti"),
            RecipeIngredient(recipe_id=recipe1.id, ingredient="eggs"),
            RecipeIngredient(recipe_id=recipe1.id, ingredient="bacon"),
            RecipeIngredient(recipe_id=recipe1.id, ingredient="parmesan")
        ]
        
        ingredients2 = [
            RecipeIngredient(recipe_id=recipe2.id, ingredient="beef tenderloin"),
            RecipeIngredient(recipe_id=recipe2.id, ingredient="puff pastry"),
            RecipeIngredient(recipe_id=recipe2.id, ingredient="mushrooms")
        ]
        
        db.session.add_all(ingredients1 + ingredients2)
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()