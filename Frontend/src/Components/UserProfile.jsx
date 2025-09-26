
import RecipeDetail from "./RecipeDetail";

const UserProfile = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{user.name}'s Profile</h1>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">My Recipes</h2>
        {user.myRecipes.map((recipe, i) => (
          <RecipeDetail key={i} recipe={recipe} />
        ))}
      </section>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Drafts</h2>
        {user.drafts.map((recipe, i) => (
          <RecipeDetail key={i} recipe={recipe} />
        ))}
      </section>

      <section>
        <h2 className="font-semibold mb-2">Favorites</h2>
        {user.favorites.map((recipe, i) => (
          <RecipeDetail key={i} recipe={recipe} />
        ))}
      </section>
    </div>
  );
};

export default UserProfile;
