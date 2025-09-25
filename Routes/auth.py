# routes/auth.py
from flask import Blueprint, request, jsonify
from app.extensions import db, jwt, BLACKLIST
from app.models import User
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    get_jwt_identity,
)

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    if not all([email, username, password]):
        return jsonify({"msg": "email, username and password required"}), 400

    exists = User.query.filter((User.email == email) | (User.username == username)).first()
    if exists:
        return jsonify({"msg": "user with that email or username already exists"}), 409

    user = User(email=email, username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)

    return jsonify({
        "access_token": access,
        "refresh_token": refresh,
        "user": user.to_dict()
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    identifier = data.get("email") or data.get("username")
    password = data.get("password")
    if not identifier or not password:
        return jsonify({"msg": "provide email/username and password"}), 400

    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "invalid credentials"}), 401

    access = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)
    return jsonify({
        "access_token": access,
        "refresh_token": refresh,
        "user": user.to_dict()
    }), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # blacklist the token jti so it cannot be used again (simple in-memory blacklist)
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"msg": "successfully logged out"}), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200
