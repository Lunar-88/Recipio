
import FavoriteButton from "./FavoriteButton";

const RecipeDetail = ({ recipe }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded mb-4" />
      )}
      <p className="mb-4">{recipe.description}</p>

      <div className="mb-4">
        <span className="font-medium">Prep:</span> {recipe.prepTime} min | 
        <span className="font-medium"> Cook:</span> {recipe.cookTime} min | 
        <span className="font-medium"> Servings:</span> {recipe.servings}
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Ingredients:</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{`${ing.quantity} ${ing.unit} ${ing.name}`}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <FavoriteButton isFavorite={recipe.isFavorite} onToggle={() => console.log("Toggle favorite")} />
    </div>
  );
};

export default RecipeDetail;
