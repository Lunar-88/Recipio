import React from 'react';
import RecipeCard from './RecipeCard.jsx'

const RecipeList = ({ recipes, favoritesSet, onToggleFavorite }) => {
  return (
    <div className="recipe-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))', gap: '1rem' }}>
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favoritesSet.has(recipe.id)}
          onToggleFavorite={() => onToggleFavorite(recipe.id)}
        />
      ))}
    </div>
  );
};

export default RecipeList;
