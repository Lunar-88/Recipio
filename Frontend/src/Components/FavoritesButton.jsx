import React from 'react';

const FavoritesButton = ({ isFavorite, onToggle }) => {
  return (
    <button onClick={onToggle}>
      {isFavorite ? '💖' : '🤍'}
    </button>
  );
};

export default FavoritesButton;
