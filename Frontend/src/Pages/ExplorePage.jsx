
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

const userId = "user123";

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

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [page, filters]);

  const loadRecipes = async () => {
    const params = { page, limit, ...filters };
    const resp = await fetchRecipes(params);
    setRecipes(resp.data.data);
    setTotalPages(resp.data.totalPages);
  };

  const loadFavorites = async () => {
    const resp = await getFavorites(userId);
    setFavorites(new Set(resp.data.favorites));
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
