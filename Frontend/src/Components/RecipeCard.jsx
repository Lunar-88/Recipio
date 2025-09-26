import React, { useState, useEffect } from "react";
import { Trash2, Star, ThumbsUp } from "lucide-react";
import FavoritesButton from "./FavoritesButton.jsx";

const RecipeCard = ({
  recipe = {},
  onShowIngredients,
  isFavorite,
  onToggleFavorite,
  onDelete,
}) => {
  const [showIngredients, setShowIngredients] = useState(false);
  const [likes, setLikes] = useState(recipe.likes ?? 0);
  const [rating, setRating] = useState(recipe.rating ?? 0);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    onShowIngredients?.(recipe.id, showIngredients);
  }, [showIngredients, recipe.id, onShowIngredients]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipe.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete recipe");
      
      // If the recipe deletion is successful, you should also delete the image from Cloudinary
      // You would need to call an API function here that uses the DELETE /api/media/<public_id> route
      // For now, we rely on the onDelete callback to refresh the list.
      
      onDelete?.(recipe.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleLike = async () => {
    setLiking(true);
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipe.id}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to like recipe");
      const data = await res.json();
      setLikes(data.likes);
    } catch (err) {
      alert(err.message);
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <img
        // 💡 CRITICAL FIX: Use the direct image URL (e.g., recipe.image_url) 
        // returned by the backend, which is now the Cloudinary URL.
        src={recipe.image_url || "/placeholder.jpg"}
        alt={recipe.title || "Untitled Recipe"}
        className="w-full h-48 object-cover"
      />

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {recipe.title || "Untitled Recipe"}
        </h3>

        {/* Rating and Likes */}
        <div className="text-sm text-gray-600 mb-3 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" /> {rating}
          </span>

          <button
            onClick={handleLike}
            disabled={liking}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
          >
            <ThumbsUp size={16} /> {likes}
          </button>
        </div>

        {/* Show/Hide Ingredients */}
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="text-sm text-blue-600 hover:underline self-start mb-2"
        >
          {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>

        {showIngredients && (
          recipe.ingredients?.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mb-3">No ingredients listed.</p>
          )
        )}

        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <FavoritesButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite?.(recipe.id)}
          />

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;