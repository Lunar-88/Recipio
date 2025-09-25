
import React, { useState, useEffect } from "react";
import {
  fetchRecipes,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../Services/API.js";
import RecipeList from "../Components/RecipeList";
import Pagination from "../Components/Pagination";

const userId = "user123";

const Home = () => {
  const [mode, setMode] = useState("popular"); 
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [mode, page]);

  const loadFavorites = async () => {
    const resp = await getFavorites(userId);
    setFavorites(new Set(resp.data.favorites));
  };

  const loadRecipes = async () => {
    let filters = {};
    if (mode === "favorites") {
      const favResp = await getFavorites(userId);
      const favIds = new Set(favResp.data.favorites);
      filters = { ids: Array.from(favIds).join(",") };
    } else if (mode === "new") {
      filters = { sortBy: "newest" };
    } else if (mode === "trending") {
      filters = { sortBy: "likes" };
    } else if (mode === "popular") {
      filters = { sortBy: "rating" };
    }

    const resp = await fetchRecipes({ page, limit, ...filters });
    setRecipes(resp.data.data);
    setTotalPages(resp.data.totalPages);
  };

  const handleToggleFavorite = async (recipeId) => {
    if (favorites.has(recipeId)) {
      await removeFavorite(userId, recipeId);
      const newFav = new Set(favorites);
      newFav.delete(recipeId);
      setFavorites(newFav);
    } else {
      await addFavorite(userId, recipeId);
      const newFav = new Set(favorites);
      newFav.add(recipeId);
      setFavorites(newFav);
    }
  };

  const tabs = [
    { id: "popular", label: "Popular" },
    { id: "new", label: "New Additions" },
    { id: "trending", label: "Trending" },
    { id: "favorites", label: "Favorites" },
  ];

  return (
    <div className="px-6 py-6">
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
