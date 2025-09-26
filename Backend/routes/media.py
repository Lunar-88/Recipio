# routes/media.py

from flask import Blueprint, request, jsonify
import cloudinary.uploader 

# 💡 Blueprint object name is now media_bp
media_bp = Blueprint("media", __name__) # This will be mounted at /api/media


# -------------------------
# Upload Media to Cloudinary: POST /api/media/upload
# -------------------------
@media_bp.route("/upload", methods=["POST"])
def upload_media():
    try:
        # Get the file from the request (expecting key 'image' from frontend FormData)
        file_to_upload = request.files.get("image")
        
        if not file_to_upload:
            return jsonify({"error": "No file uploaded (expecting key 'image')"}), 400

        # Upload the file stream directly to Cloudinary
        upload_result = cloudinary.uploader.upload(
            file_to_upload,
            folder="recipio-images"  # Specify a folder name
        )

        # Return the public_id and secure_url
        return jsonify({
            "url": upload_result['secure_url'],
            "id": upload_result['public_id']
        }), 201

    except Exception as e:
        # Log the error for debugging
        print(f"Cloudinary Upload Error: {e}") 
        return jsonify({"error": "Failed to upload image to Cloudinary"}), 500


# -------------------------
# Delete Media from Cloudinary: DELETE /api/media/<public_id>
# -------------------------
@media_bp.route("/<string:public_id>", methods=["DELETE"])
def delete_media(public_id):
    try:
        # Delete the image from Cloudinary using the public_id
        deletion_result = cloudinary.uploader.destroy(public_id)

        if deletion_result.get('result') == 'ok':
            return jsonify({"message": f"Image {public_id} deleted successfully"}), 200
        else:
            # Handle cases where Cloudinary can't find the file
            return jsonify({"error": f"Cloudinary deletion failed: {deletion_result.get('result', 'Unknown error')}"}), 404
            
    except Exception as e:
        print(f"Cloudinary Deletion Error: {e}")
        return jsonify({"error": "Failed to delete image from Cloudinary"}), 500