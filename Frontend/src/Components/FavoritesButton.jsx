import React from 'react';
import { Heart } from 'lucide-react';

const FavoritesButton = ({ isFavorite, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full hover:bg-red-100 transition-colors"
    >
      <Heart
        className={`w-6 h-6 transition-colors ${
          isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
        }`}
      />
    </button>
  );
};

export default FavoritesButton;
