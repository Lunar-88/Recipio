
import React, { useState } from "react";

const SearchFilter = ({ onSearch, filters = {}, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <input
          type="text"
          placeholder="🔍 Search keywords, chefs, ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mt-4">
        <select
          onChange={(e) => onFilterChange("cuisine", e.target.value)}
          value={filters.cuisine || ""}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Indian">Indian</option>
        </select>

        <select
          onChange={(e) => onFilterChange("dietary", e.target.value)}
          value={filters.dietary || ""}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Diets</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
        </select>

        <select
          onChange={(e) => onFilterChange("difficulty", e.target.value)}
          value={filters.difficulty || ""}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Any Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          onChange={(e) => onFilterChange("sortBy", e.target.value)}
          value={filters.sortBy || ""}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Sort By</option>
          <option value="rating">Rating</option>
          <option value="likes">Likes</option>
          <option value="newest">Newest</option>
        </select>

        <select
          onChange={(e) => onFilterChange("time", e.target.value)}
          value={filters.time || ""}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
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
