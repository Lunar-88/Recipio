const API_BASE = 'http://localhost:5174';


function buildUrlWithParams(url, params = {}) {
  const query = new URLSearchParams(params).toString();
  return query ? `${url}?${query}` : url;
}

export const fetchRecipes = async (params) => {
  const url = buildUrlWithParams(`${API_BASE}/recipes`, params);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching recipes: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const fetchRecipeById = async (id) => {
  const response = await fetch(`${API_BASE}/recipes/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching recipe ${id}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const getFavorites = async (userId) => {
  const response = await fetch(`${API_BASE}/favorites/${userId}`);
  if (!response.ok) {
    throw new Error(`Error getting favorites for user ${userId}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const addFavorite = async (userId, recipeId) => {
  const response = await fetch(
    `${API_BASE}/favorites/${userId}/${recipeId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
  if (!response.ok) {
    throw new Error(`Error adding favorite: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const removeFavorite = async (userId, recipeId) => {
  const response = await fetch(
    `${API_BASE}/favorites/${userId}/${recipeId}`,
    {
      method: 'DELETE'
    }
  );
  if (!response.ok) {
    throw new Error(`Error removing favorite: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
