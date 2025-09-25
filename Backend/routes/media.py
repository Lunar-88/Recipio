
from flask import Blueprint, request, jsonify
import uuid
from extensions import db          # ✅ avoids circular import
from models import Media           # safe to import models here

media_bp = Blueprint("media", __name__, url_prefix="/api/media")

# -------------------------
# Upload Media
# -------------------------
@media_bp.route("/upload", methods=["POST"])
def upload_media():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Generate unique ID for this media
    media_id = str(uuid.uuid4())

    # TODO: Save to S3 or disk later — for now we fake keys
    sizes = {
        "thumb": f"{media_id}_thumb.jpg",
        "medium": f"{media_id}_medium.jpg",
        "original": f"{media_id}_original.jpg"
    }

    # Save record to database
    media = Media(id=media_id, s3_key=sizes["original"], sizes=sizes)
    db.session.add(media)
    db.session.commit()

    return jsonify({"id": media_id, "sizes": sizes}), 201


# -------------------------
# Get Signed URL
# -------------------------
@media_bp.route("/<string:media_id>/signed-url", methods=["GET"])
def get_signed_url(media_id):
    size = request.args.get("size", "thumb")

    media = Media.query.get(media_id)
    if not media:
        return jsonify({"error": "Media not found"}), 404

    key = media.sizes.get(size)
    if not key:
        return jsonify({"error": f"Size '{size}' not found"}), 404

    # Dummy URL for now — replace with AWS S3 signed URL later
    url = f"http://localhost:5000/static/{key}"
    return jsonify({"url": url}), 200
