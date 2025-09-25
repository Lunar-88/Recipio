
import React from "react";
import RecipeCard from "./RecipeCard.jsx";

const RecipeList = ({ recipes, favoritesSet, onToggleFavorite }) => {
  return (
    <div
      className="
        grid 
        gap-6 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        auto-rows-fr
      "
    >
      {recipes.map((recipe) => (
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

