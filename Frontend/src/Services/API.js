// API.js
const API_BASE = 'http://localhost:5000/api'; // Flask backend

/**
 * Utility to build URLs with query parameters
 */
function buildUrlWithParams(url, params = {}) {
  const query = new URLSearchParams(params).toString();
  return query ? `${url}?${query}` : url;
}

// --------------------
// Recipes
// --------------------
export const fetchRecipes = async (params = {}) => {
  const url = buildUrlWithParams(`${API_BASE}/recipes/search`, params);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error fetching recipes: ${response.statusText}`);
  const data = await response.json();
  // return consistent structure
  return {
    results: data.results || [],
    total: data.total || data.results?.length || 0,
  };
};

export const fetchRecipeById = async (id) => {
  const response = await fetch(`${API_BASE}/recipes/${id}`);
  if (!response.ok) throw new Error(`Error fetching recipe ${id}: ${response.statusText}`);
  const data = await response.json();
  return data;
};

export const createRecipe = async (recipeData) => {
  const response = await fetch(`${API_BASE}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipeData),
  });
  if (!response.ok) throw new Error(`Error creating recipe: ${response.statusText}`);
  return await response.json();
};

// --------------------
// Favorites / Likes
// --------------------
export const getFavorites = async (userId) => {
  // Ensure numeric userId
  const id = Number(userId);
  const response = await fetch(`${API_BASE}/favorites/${id}`);
  if (!response.ok) throw new Error(`Error getting favorites: ${response.statusText}`);
  const data = await response.json();
  return {
    favorites: data.favorites || [],
  };
};

export const addFavorite = async (userId, recipeId) => {
  const response = await fetch(`${API_BASE}/favorites/${Number(userId)}/${recipeId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`Error adding favorite: ${response.statusText}`);
  return await response.json();
};

export const removeFavorite = async (userId, recipeId) => {
  const response = await fetch(`${API_BASE}/favorites/${Number(userId)}/${recipeId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Error removing favorite: ${response.statusText}`);
  return await response.json();
};

// --------------------
// Media / Images (Updated for Cloudinary)
// --------------------
export const uploadImage = async (file) => {
  const formData = new FormData();
  // 💡 CRITICAL FIX: The key must be 'image' to match request.files.get("image") in Flask
  formData.append('image', file); 

  const response = await fetch(`${API_BASE}/media/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    // Attempt to get error message from backend for better debugging
    const errorData = await response.json();
    throw new Error(`Image upload failed: ${errorData.error || response.statusText}`);
  }
  
  // Returns { id: public_id, url: secure_url }
  return await response.json(); 
};

/**
 * 🗑️ REMOVED: This function is obsolete. 
 * With Cloudinary, the frontend uses the direct URL returned by uploadImage.
 *
 * export const getMediaSignedUrl = async (mediaId, size = 'thumb') => {
 * // ... code removed
 * };
 */

// --------------------
// Cloudinary Deletion Utility (New)
// --------------------
export const deleteImage = async (publicId) => {
  // Uses the DELETE /api/media/<public_id> route
  const response = await fetch(`${API_BASE}/media/${publicId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
     const errorData = await response.json();
     throw new Error(`Image deletion failed: ${errorData.error || response.statusText}`);
  }
  return await response.json();
};