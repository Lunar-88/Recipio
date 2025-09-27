
import React, { useState, useEffect } from "react";
import {
  fetchRecipes,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../Services/API.js";
import RecipeList from "../Components/RecipeList";
import Pagination from "../Components/Pagination";

const userId = 123; // numeric ID to match Flask route

const Home = () => {
  const [mode, setMode] = useState("popular");
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Reload recipes when mode or page changes
  useEffect(() => {
    loadRecipes();
  }, [mode, page]);

  const loadFavorites = async () => {
    try {
      const resp = await getFavorites(userId);
      setFavorites(new Set(resp.favorites || []));
    } catch (err) {
      console.error("Failed to load favorites:", err);
      setFavorites(new Set());
    }
  };

  const loadRecipes = async () => {
    try {
      let filters = { page, per_page: limit };

      if (mode === "favorites") {
        // Show only favorite recipes
        const favResp = await getFavorites(userId);
        const favIds = favResp.favorites || [];
        if (favIds.length === 0) {
          setRecipes([]);
          setTotalPages(1);
          return;
        }
        filters.ids = favIds.join(","); // Ensure backend can filter by IDs
      } else if (mode === "new") {
        filters.sort = "new";
      } else if (mode === "trending") {
        filters.sort = "trending";
      } else if (mode === "popular") {
        filters.sort = "popular";
      }

      const resp = await fetchRecipes(filters);
      setRecipes(resp.results || []);
      setTotalPages(Math.ceil((resp.total || resp.results.length) / limit));
    } catch (err) {
      console.error("Failed to load recipes:", err);
      setRecipes([]);
      setTotalPages(1);
    }
  };

  const handleToggleFavorite = async (recipeId) => {
    try {
      const newFav = new Set(favorites);
      if (favorites.has(recipeId)) {
        await removeFavorite(userId, recipeId);
        newFav.delete(recipeId);
      } else {
        await addFavorite(userId, recipeId);
        newFav.add(recipeId);
      }
      setFavorites(newFav);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const tabs = [
    { id: "popular", label: "Popular" },
    { id: "new", label: "New Additions" },
    { id: "trending", label: "Trending" },
    { id: "favorites", label: "Favorites" },
  ];

  return (
    <div className="px-6 py-6 w-screen max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-6 border-b pb-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setMode(t.id);
              setPage(1);
            }}
            className={`pb-2 text-lg ${
              mode === t.id
                ? "font-semibold text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-orange-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      <RecipeList
        recipes={recipes}
        favoritesSet={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default Home;
