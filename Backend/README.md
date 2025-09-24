# Recipio Backend API

Recipe sharing application backend built with Flask.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables in `.env`:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/recipio_dev
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
```

3. Initialize database:
```bash
python seed_data.py
```

4. Run the application:
```bash
python app.py
```

## API Endpoints

### Search Recipes
```
GET /api/recipes/search
```

Query Parameters:
- `q` - keyword search
- `ingredients` - comma-separated list (e.g., "eggs,milk")
- `chef` - chef name
- `cuisine` - cuisine type
- `dietary` - comma-separated dietary restrictions
- `time_lt` - max cooking time in minutes
- `difficulty` - easy/medium/hard
- `sort` - popular/trending/new
- `page` - page number (default: 1)
- `per_page` - results per page (default: 20, max: 100)

Example:
```bash
curl "http://localhost:5000/api/recipes/search?q=pasta&ingredients=eggs&sort=popular&page=1"
```

### Upload Media
```
POST /api/media/upload
```

Form data:
- `file` - image file (PNG, JPG, JPEG, WebP)

Example:
```bash
curl -X POST -F "file=@image.jpg" http://localhost:5000/api/media/upload
```

### Get Signed URL
```
GET /api/media/<media_id>/signed-url?size=thumb
```

Sizes: `original`, `medium`, `thumb`

Example:
```bash
curl "http://localhost:5000/api/media/123e4567-e89b-12d3-a456-426614174000/signed-url?size=thumb"
```

## Features Implemented

✅ Recipe search with multiple filters  
✅ Ingredient matching (requires ALL ingredients)  
✅ Sorting by popularity, trending, and newest  
✅ Pagination  
✅ Image upload with automatic resizing  
✅ Secure image serving via S3 signed URLs  
✅ PostgreSQL database with proper relationships