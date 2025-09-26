import React, { useState } from "react";
import FavoritesButton from "./FavoritesButton.jsx";

const RecipeCard = ({
  recipe = {},
  onShowIngredients,
  isFavorite,
  onToggleFavorite,
  onDelete, // callback prop for deletion
}) => {
  const [showIngredients, setShowIngredients] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipe.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete recipe");

      onDelete?.(recipe.id); // notify parent to remove from UI
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <img
        src={
          recipe.media_id
            ? `http://localhost:5000/api/media/${recipe.media_id}`
            : "/placeholder.jpg"
        }
        alt={recipe.title || "Untitled Recipe"}
        className="w-full h-48 object-cover"
      />

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {recipe.title || "Untitled Recipe"}
        </h3>

        <div className="text-sm text-gray-600 mb-3">
          ⭐ {recipe.rating ?? "N/A"} • 👍 {recipe.likes ?? 0}
        </div>

        {/* Show/Hide Ingredients */}
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="text-sm text-blue-600 hover:underline self-start mb-2"
        >
          {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>

        {showIngredients && recipe.ingredients?.length > 0 && (
          <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        )}

        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <FavoritesButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite?.(recipe.id)}
          />
          <button
            onClick={handleDelete}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

