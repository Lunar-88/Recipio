import React, { useState, useEffect } from 'react';
import { fetchRecipes, getFavorites, addFavorite, removeFavorite } from '../services/api';
import RecipeList from '../components/RecipeList';
import FavoriteButton from '../components/FavoriteButton';
import Pagination from '../components/Pagination';

const userId = 'user123';

const Home = () => {
  const [mode, setMode] = useState('popular'); // or 'trending', 'new', 'favorites'
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

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
    if (mode === 'favorites') {
      // load all favorites
      const favResp = await getFavorites(userId);
      const favIds = new Set(favResp.data.favorites);
      // you might fetch recipe details for these IDs
      // for simplicity assuming backend supports filter by IDs
      filters = { ids: Array.from(favIds).join(',') };
    } else if (mode === 'new') {
      filters = { sortBy: 'newest' };
    } else if (mode === 'trending') {
      filters = { sortBy: 'likes' };
    } else if (mode === 'popular') {
      filters = { sortBy: 'rating' };
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

  return (
    <div>
      <div className="mode-tabs">
        {['popular','trending','new','favorites'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setPage(1); }}
            style={{ fontWeight: m === mode ? 'bold' : 'normal' }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <RecipeList
        recipes={recipes}
        favoritesSet={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={p => setPage(p)}
      />
    </div>
  );
};

export default Home;
