
from flask import Blueprint, request, jsonify, send_file
from bson import ObjectId
import io, traceback

from extensions import fs, mongo_db

media_bp = Blueprint("media", __name__, url_prefix="/api/media")


# -------------------------
# Upload Media
# -------------------------
@media_bp.route("/upload", methods=["POST"])
def upload_media():
    try:
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        # ✅ Save to GridFS (use file.stream, not file)
        file_id = fs.put(file.stream, filename=file.filename, content_type=file.content_type)

        # ✅ Store metadata
        try:
            mongo_db.media_metadata.insert_one({
                "_id": file_id,
                "filename": file.filename,
                "content_type": file.content_type
            })
        except Exception as meta_err:
            # Metadata is optional — don’t fail upload if this breaks
            print("Metadata insert failed:", meta_err)

        return jsonify({"id": str(file_id)}), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


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
        traceback.print_exc()
        return jsonify({"error": f"File not found: {str(e)}"}), 404


# -------------------------
# Delete Media
# -------------------------
@media_bp.route("/<string:file_id>", methods=["DELETE"])
def delete_media(file_id):
    try:
        fs.delete(ObjectId(file_id))
        mongo_db.media_metadata.delete_one({"_id": ObjectId(file_id)})
        return jsonify({"message": "File deleted"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"File not found: {str(e)}"}), 404
