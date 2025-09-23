from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock data for testing
mock_recipes = [
    {
        "id": 1,
        "title": "Spaghetti Carbonara",
        "description": "Classic Italian pasta dish",
        "chef": "Gordon Ramsay",
        "cuisine": "Italian",
        "dietary": ["vegetarian"],
        "cook_time_minutes": 30,
        "difficulty": "medium",
        "popularity_score": 95,
        "ingredients": ["spaghetti", "eggs", "bacon", "parmesan"],
        "created_at": "2024-01-01T12:00:00"
    },
    {
        "id": 2,
        "title": "Beef Wellington",
        "description": "Tender beef wrapped in pastry",
        "chef": "Gordon Ramsay",
        "cuisine": "British",
        "dietary": [],
        "cook_time_minutes": 120,
        "difficulty": "hard",
        "popularity_score": 88,
        "ingredients": ["beef tenderloin", "puff pastry", "mushrooms"],
        "created_at": "2024-01-02T12:00:00"
    },
    {
        "id": 3,
        "title": "Chocolate Cake",
        "description": "Rich chocolate dessert",
        "chef": "Julia Child",
        "cuisine": "French",
        "dietary": ["vegetarian"],
        "cook_time_minutes": 60,
        "difficulty": "easy",
        "popularity_score": 92,
        "ingredients": ["chocolate", "flour", "eggs", "butter"],
        "created_at": "2024-01-03T12:00:00"
    }
]

@app.route('/api/recipes/search', methods=['GET'])
def search_recipes():
    q = request.args.get('q', '').lower()
    ingredients = request.args.get('ingredients', '').lower().split(',') if request.args.get('ingredients') else []
    chef = request.args.get('chef', '').lower()
    cuisine = request.args.get('cuisine', '').lower()
    dietary = request.args.get('dietary', '').lower().split(',') if request.args.get('dietary') else []
    time_lt = request.args.get('time_lt', type=int)
    difficulty = request.args.get('difficulty', '').lower()
    sort = request.args.get('sort', 'new')
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)

    # Filter recipes
    filtered = []
    for recipe in mock_recipes:
        # Text search
        if q and q not in recipe['title'].lower() and q not in recipe['description'].lower():
            continue
        
        # Chef filter
        if chef and chef not in recipe['chef'].lower():
            continue
            
        # Cuisine filter
        if cuisine and cuisine != recipe['cuisine'].lower():
            continue
            
        # Time filter
        if time_lt and recipe['cook_time_minutes'] > time_lt:
            continue
            
        # Difficulty filter
        if difficulty and difficulty != recipe['difficulty'].lower():
            continue
            
        # Dietary filter
        if dietary and dietary != ['']:
            recipe_dietary = [d.lower() for d in recipe['dietary']]
            if not all(d.strip() in recipe_dietary for d in dietary if d.strip()):
                continue
                
        # Ingredients filter (all must be present)
        if ingredients and ingredients != ['']:
            recipe_ingredients = [i.lower() for i in recipe['ingredients']]
            if not all(ing.strip() in recipe_ingredients for ing in ingredients if ing.strip()):
                continue
                
        filtered.append(recipe)

    # Sort
    if sort == 'popular':
        filtered.sort(key=lambda x: x['popularity_score'], reverse=True)
    elif sort == 'trending':
        filtered.sort(key=lambda x: (x['popularity_score'], x['created_at']), reverse=True)
    else:  # new
        filtered.sort(key=lambda x: x['created_at'], reverse=True)

    # Pagination
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    results = filtered[start:end]

    return jsonify({
        "page": page,
        "per_page": per_page,
        "total": total,
        "results": results
    })

@app.route('/api/media/upload', methods=['POST'])
def upload_media():
    if 'file' not in request.files:
        return jsonify({"error": "no file"}), 400
    
    file = request.files['file']
    if not file.filename:
        return jsonify({"error": "no filename"}), 400

    # Mock response
    media_id = str(uuid.uuid4())
    return jsonify({
        "id": media_id,
        "sizes": {
            "original": f"/mock/images/{media_id}/original.jpg",
            "medium": f"/mock/images/{media_id}/medium.jpg",
            "thumb": f"/mock/images/{media_id}/thumb.jpg"
        }
    }), 201

@app.route('/api/media/<media_id>/signed-url', methods=['GET'])
def get_signed_url(media_id):
    size = request.args.get('size', 'thumb')
    return jsonify({
        "url": f"https://mock-s3-bucket.s3.amazonaws.com/images/{media_id}/{size}.jpg?expires=3600"
    })

if __name__ == '__main__':
    print("Starting test server...")
    print("Available endpoints:")
    print("- GET /api/recipes/search")
    print("- POST /api/media/upload") 
    print("- GET /api/media/<id>/signed-url")
    app.run(debug=True, port=5000)