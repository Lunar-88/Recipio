# auth_middleware.py
# Helpers / decorators for authentication & ownership checks.
#
# Assumes:
#   from app.extensions import jwt
#   flask_jwt_extended is installed and configured in the app factory.

from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import jwt_required as _jwt_required, get_jwt_identity
from app.extensions import db

def jwt_required(fn):
    """Wrapper around flask_jwt_extended.jwt_required to keep imports tidy."""
    return _jwt_required(fn)

def ensure_self_or_forbidden(param_user_id_name="user_id"):
    """
    Decorator for endpoints that should only be modifiable by the user themself.
    Example usage on PUT /users/<int:user_id>:
      @jwt_required
      @ensure_self_or_forbidden("user_id")
      def update_user(user_id): ...
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            current_user_id = get_jwt_identity()
            # param name may be 'user_id' or 'id' depending on route
            requested_id = kwargs.get(param_user_id_name) or kwargs.get("id")
            if requested_id is None:
                # try reading from JSON body
                requested_id = (request.get_json() or {}).get(param_user_id_name)
            if requested_id is None:
                return jsonify({"msg": "user id required"}), 400
            if int(requested_id) != int(current_user_id):
                return jsonify({"msg": "forbidden"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

def ownership_required(model_class, id_kwarg="id", owner_field="owner_id"):
    """
    Generic ownership checker.
    Usage:
      from app.models import Recipe
      @jwt_required
      @ownership_required(Recipe, id_kwarg="recipe_id", owner_field="owner_id")
      def edit_recipe(recipe_id): ...
    The decorated route must provide the resource id as a URL kwarg (or JSON body fallback).
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            resource_id = kwargs.get(id_kwarg)
            if resource_id is None:
                resource_id = (request.get_json() or {}).get(id_kwarg)
            if resource_id is None:
                return jsonify({"msg": f"{id_kwarg} required"}), 400

            resource = model_class.query.get(resource_id)
            if not resource:
                return jsonify({"msg": "resource not found"}), 404

            current_user_id = get_jwt_identity()
            owner_val = getattr(resource, owner_field, None)
            if owner_val is None:
                return jsonify({"msg": "resource has no owner field configured"}), 500

            if int(owner_val) != int(current_user_id):
                return jsonify({"msg": "forbidden"}), 403

            # attach resource to kwargs for convenience in route if desired
            kwargs["_resource"] = resource
            return f(*args, **kwargs)
        return wrapper
    return decorator
