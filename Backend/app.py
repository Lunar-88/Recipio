from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy import func, desc, or_
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime
import boto3
from PIL import Image
from io import BytesIO

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://user:pass@localhost:5432/recipio')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['AWS_REGION'] = os.getenv('AWS_REGION')
app.config['S3_BUCKET'] = os.getenv('S3_BUCKET')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Models
class Chef(db.Model):
    __tablename__ = 'chefs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

class Recipe(db.Model):
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    chef_id = db.Column(db.Integer, db.ForeignKey('chefs.id'))
    chef = db.relationship('Chef', backref='recipes')
    cuisine = db.Column(db.String)
    dietary = db.Column(ARRAY(db.String))
    cook_time_minutes = db.Column(db.Integer)
    difficulty = db.Column(db.String)
    popularity_score = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=func.now())

class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))
    recipe = db.relationship('Recipe', backref='ingredients')
    ingredient = db.Column(db.String, nullable=False)

class Media(db.Model):
    __tablename__ = 'media'
    id = db.Column(db.String, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))
    s3_key = db.Column(db.String)
    sizes = db.Column(JSONB)
    created_at = db.Column(db.DateTime, server_default=func.now())

# S3 Service
def s3_client():
    return boto3.client('s3',
        region_name=app.config['AWS_REGION'],
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))

def resize_image(file_bytes, size=None, max_width=None):
    img = Image.open(BytesIO(file_bytes)).convert('RGB')
    if size:
        img.thumbnail(size, Image.LANCZOS)
    elif max_width:
        w_percent = max_width / float(img.size[0])
        h_size = int(float(img.size[1]) * w_percent)
        img = img.resize((max_width, h_size), Image.LANCZOS)
    out = BytesIO()
    img.save(out, format='JPEG', quality=85)
    out.seek(0)
    return out

# Routes
@app.route('/api/recipes/search', methods=['GET'])
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

    query = db.session.query(Recipe)

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
            "created_at": r.created_at.isoformat()
        } for r in results]
    })

@app.route('/api/media/upload', methods=['POST'])
def upload_media():
    if 'file' not in request.files:
        return jsonify({"error": "no file"}), 400
    
    file = request.files['file']
    if not file.filename or not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        return jsonify({"error": "invalid file"}), 400

    file_bytes = file.read()
    media_id = str(uuid.uuid4())
    base_key = f"images/{media_id}"

    # Create variants
    original_io = resize_image(file_bytes)
    medium_io = resize_image(file_bytes, max_width=800)
    thumb_io = resize_image(file_bytes, size=(200, 200))

    keys = {
        "original": f"{base_key}/original.jpg",
        "medium": f"{base_key}/medium.jpg", 
        "thumb": f"{base_key}/thumb.jpg"
    }

    # Upload to S3
    client = s3_client()
    bucket = app.config['S3_BUCKET']
    
    for size, key in keys.items():
        io_obj = {"original": original_io, "medium": medium_io, "thumb": thumb_io}[size]
        io_obj.seek(0)
        client.put_object(Bucket=bucket, Key=key, Body=io_obj.read(), 
                         ContentType='image/jpeg', ACL='private')

    # Save to DB
    media = Media(id=media_id, s3_key=keys["original"], sizes=keys)
    db.session.add(media)
    db.session.commit()

    return jsonify({"id": media_id, "sizes": keys}), 201

@app.route('/api/media/<media_id>/signed-url', methods=['GET'])
def get_signed_url(media_id):
    size = request.args.get('size', 'thumb')
    media = Media.query.get(media_id)
    
    if not media:
        return jsonify({"error": "not found"}), 404
    
    key = media.sizes.get(size)
    if not key:
        return jsonify({"error": "size not found"}), 404

    client = s3_client()
    url = client.generate_presigned_url('get_object',
        Params={'Bucket': app.config['S3_BUCKET'], 'Key': key},
        ExpiresIn=3600)
    
    return jsonify({"url": url})

if __name__ == '__main__':
    app.run(debug=True, port=5000)