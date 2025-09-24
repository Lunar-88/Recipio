
import React, { useState } from 'react';

const SearchFilter = ({ onSearch, filters = {}, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-filter">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search keywords, chefs, ingredients..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="filters">
        <select onChange={e => onFilterChange('cuisine', e.target.value)} value={filters.cuisine || ''}>
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Indian">Indian</option>
          
        </select>

        <select onChange={e => onFilterChange('dietary', e.target.value)} value={filters.dietary || ''}>
          <option value="">All Diets</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
        </select>

        <select onChange={e => onFilterChange('difficulty', e.target.value)} value={filters.difficulty || ''}>
          <option value="">Any Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select onChange={e => onFilterChange('sortBy', e.target.value)} value={filters.sortBy || ''}>
          <option value="">Sort By</option>
          <option value="rating">Rating</option>
          <option value="likes">Likes</option>
          <option value="newest">Newest</option>
        </select>

        <select onChange={e => onFilterChange('time', e.target.value)} value={filters.time || ''}>
          <option value="">Any Time</option>
          <option value="15">≤ 15 min</option>
          <option value="30">≤ 30 min</option>
          <option value="60">≤ 60 min</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
