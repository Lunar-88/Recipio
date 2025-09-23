import React, { useState, useEffect } from 'react';
import { fetchRecipes, getFavorites, addFavorite, removeFavorite } from '../services/api';
import SearchFilter from '../components/SearchFilter';
import RecipeList from '../components/RecipeList';
import Pagination from '../components/Pagination';

const userId = 'user123';  

const Explore = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({
    q: '',
    cuisine: '',
    dietary: '',
    difficulty: '',
    time: '',
    sortBy: ''
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
    setFilters(f => ({ ...f, q: searchTerm }));
    setPage(1);  // reset to first page
  };

  const handleFilterChange = (field, value) => {
    setFilters(f => ({ ...f, [field]: value }));
    setPage(1);
  };

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  return (
    <div>
      <SearchFilter
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <RecipeList
        recipes={recipes}
        favoritesSet={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Explore;
