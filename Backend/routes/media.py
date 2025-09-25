
from flask import Blueprint, request, jsonify, send_file
from bson import ObjectId
import io

from extensions import fs, mongo_db

media_bp = Blueprint("media", __name__, url_prefix="/api/media")

# -------------------------
# Upload Media
# -------------------------
@media_bp.route("/upload", methods=["POST"])
def upload_media():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save to GridFS
    file_id = fs.put(file, filename=file.filename, content_type=file.content_type)

    # Optionally store metadata in MongoDB (separate collection)
    mongo_db.media_metadata.insert_one({
        "_id": file_id,
        "filename": file.filename,
        "content_type": file.content_type
    })

    return jsonify({"id": str(file_id)}), 201


# -------------------------
# Get Media
# -------------------------
@media_bp.route("/<string:file_id>", methods=["GET"])
def get_media(file_id):
    try:
        grid_out = fs.get(ObjectId(file_id))
        return send_file(
            io.BytesIO(grid_out.read()),
            mimetype=grid_out.content_type,
            download_name=grid_out.filename
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 404
