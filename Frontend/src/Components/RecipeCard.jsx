
import React, { useState } from 'react';
import FavoriteButton from "./FavoriteButton.jsx";

const RecipeCard = ({ recipe = {}, onShowIngredients, isFavorite, onToggleFavorite }) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div className="recipe-card">
      <img
        src={recipe.imageUrl || "/placeholder.jpg"}
        alt={recipe.title || "Untitled Recipe"}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />

      <h3>{recipe.title || "Untitled Recipe"}</h3>

      <div>
        ⭐ {recipe.rating ?? "N/A"} • 👍 {recipe.likes ?? 0}
      </div>

      <button onClick={() => setShowIngredients(!showIngredients)}>
        {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
      </button>

      {showIngredients && recipe.ingredients?.length > 0 && (
        <ul>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      )}

      <FavoriteButton
        isFavorite={isFavorite}
        onToggle={() => onToggleFavorite?.(recipe.id)}
      />
    </div>
  );
};

export default RecipeCard;

