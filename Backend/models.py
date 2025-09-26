
from extensions import db
from datetime import datetime

# ------------------
# Chef Model
# ------------------
class Chef(db.Model):
    __tablename__ = "chefs"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Relationships
    recipes = db.relationship("Recipe", backref="chef", cascade="all, delete-orphan")


# ------------------
# Recipe + Metadata
# ------------------
class Recipe(db.Model):
    __tablename__ = "recipes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    chef_id = db.Column(db.Integer, db.ForeignKey("chefs.id"), nullable=False)
    cuisine = db.Column(db.String(100))
    dietary = db.Column(db.PickleType, default=[])  # list of dietary tags
    cook_time_minutes = db.Column(db.Integer)
    difficulty = db.Column(db.String(50))
    popularity_score = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default="draft")  # draft vs published
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ✅ New column to directly reference one media file
    media_id = db.Column(db.String, db.ForeignKey("media.id"), nullable=True)

    # Relationships
    ingredients = db.relationship("RecipeIngredient", backref="recipe", cascade="all, delete-orphan")
    instructions = db.relationship("Instruction", backref="recipe", cascade="all, delete-orphan")
    likes = db.relationship("Like", backref="recipe", cascade="all, delete-orphan")
    ratings = db.relationship("Rating", backref="recipe", cascade="all, delete-orphan")

    # ✅ One-to-one relation to Media
    media = db.relationship("Media", backref="recipe", foreign_keys=[media_id], uselist=False)

    # ------------------
    # Methods
    # ------------------
    def likes_count(self):
        return len(self.likes)

    def avg_rating(self):
        if not self.ratings:
            return 0
        return sum(r.stars for r in self.ratings) / len(self.ratings)

    def update_popularity(self):
        self.popularity_score = (self.likes_count() * 2) + (self.avg_rating() * 10)
        db.session.commit()


class RecipeIngredient(db.Model):
    __tablename__ = "recipe_ingredients"

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)
    ingredient = db.Column(db.String(200), nullable=False)


class Instruction(db.Model):
    __tablename__ = "instructions"

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)
    step_number = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)


# ------------------
# Media Model
# ------------------
class Media(db.Model):
    __tablename__ = "media"

    id = db.Column(db.String, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"))
    s3_key = db.Column(db.String)
    sizes = db.Column(db.PickleType)  # or JSONB if using Postgres
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ------------------
# Engagement Models
# ------------------
class Like(db.Model):
    __tablename__ = "likes"

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)  # replace with FK when user model is ready
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Rating(db.Model):
    __tablename__ = "ratings"

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    stars = db.Column(db.Integer, nullable=False)  # 1–5
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
