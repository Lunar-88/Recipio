
import React, { useState, useEffect } from "react";
import {
  fetchRecipes,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../Services/API.js";
import SearchFilter from "../Components/SearchFilter.jsx";
import RecipeList from "../Components/RecipeList.jsx";
import Pagination from "../Components/Pagination.jsx";

const userId = 123; // numeric ID to match Flask route

const Explore = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({
    q: "",
    cuisine: "",
    dietary: "",
    difficulty: "",
    time: "",
    sortBy: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Reload recipes whenever page or filters change
  useEffect(() => {
    loadRecipes();
  }, [page, filters]);

  const loadRecipes = async () => {
    try {
      const params = { page, limit, ...filters };
      const resp = await fetchRecipes(params);

      // Ensure safe defaults
      const data = resp?.results || [];
      const total = resp?.total || data.length;

      setRecipes(data);
      setTotalPages(Math.ceil(total / limit));
    } catch (err) {
      console.error("Failed to load recipes:", err);
      setRecipes([]);
      setTotalPages(1);
    }
  };

  const loadFavorites = async () => {
    try {
      const resp = await getFavorites(userId);
      const favs = resp?.favorites || [];
      setFavorites(new Set(favs));
    } catch (err) {
      console.error("Failed to load favorites:", err);
      setFavorites(new Set());
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

  const handleSearch = (searchTerm) => {
    setFilters((f) => ({ ...f, q: searchTerm }));
    setPage(1); // reset to first page
  };

  const handleFilterChange = (field, value) => {
    setFilters((f) => ({ ...f, [field]: value }));
    setPage(1);
  };

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search & Filters */}
      <SearchFilter
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Recipe List */}
      <div className="mt-6">
        <RecipeList
          recipes={recipes}
          favoritesSet={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Explore;
