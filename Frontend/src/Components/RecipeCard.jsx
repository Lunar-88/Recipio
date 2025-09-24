import React, { useState } from 'react';
import FavoritesButton from './FavoritesButton.jsx'

const RecipeCard = ({ recipe, onShowIngredients, isFavorite, onToggleFavorite }) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div className="recipe-card">
      <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3>{recipe.title}</h3>
      <div>
        ⭐ {recipe.rating} • 👍 {recipe.likes}
      </div>
      <button onClick={() => setShowIngredients(!showIngredients)}>
        {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
      </button>
      {showIngredients && (
        <ul>
          {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>
      )}
      <FavoritesButton
        isFavorite={isFavorite}
        onToggle={() => onToggleFavorite(recipe.id)}
      />
    </div>
  );
};

export default RecipeCard;
