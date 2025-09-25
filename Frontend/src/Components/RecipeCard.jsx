
import React, { useState } from "react";
import FavoritesButton from "./FavoritesButton.jsx";

const RecipeCard = ({
  recipe = {},
  onShowIngredients,
  isFavorite,
  onToggleFavorite,
}) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <img
        src={recipe.imageUrl || "/placeholder.jpg"}
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

        {/* Favorite Button */}
        <div className="mt-auto">
          <FavoritesButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite?.(recipe.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
