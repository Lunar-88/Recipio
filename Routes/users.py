# routes/users.py
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.auth_middleware import ensure_self_or_forbidden

users_bp = Blueprint("users", __name__, url_prefix="/users")

@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@users_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
@ensure_self_or_forbidden("user_id")
def update_user(user_id):
    data = request.get_json() or {}
    user = User.query.get_or_404(user_id)

    # fields allowed to be updated
    allowed = {"name", "avatar_url", "preferences", "username"}
    for k in allowed:
        if k in data:
            setattr(user, k, data[k])

    # optional password change handled explicitly
    if "password" in data:
        user.set_password(data["password"])

    db.session.commit()
    return jsonify(user.to_dict()), 200

@users_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
@ensure_self_or_forbidden("user_id")
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "account deleted"}), 200
