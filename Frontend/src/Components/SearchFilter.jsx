
import React, { useState } from "react";

const SearchFilter = ({ onSearch, filters = {}, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    onFilterChange("reset", {}); // parent should reset filters
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
          aria-label="Search recipes"
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
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Clear
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mt-4">
        <select
          onChange={(e) => onFilterChange("cuisine", e.target.value)}
          value={filters.cuisine || ""}
          aria-label="Filter by cuisine"
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Cuisines</option>
          <option value="italian">Italian</option>
          <option value="indian">Indian</option>
        </select>

        <select
          onChange={(e) => onFilterChange("dietary", e.target.value)}
          value={filters.dietary || ""}
          aria-label="Filter by dietary preference"
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Diets</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
        </select>

        <select
          onChange={(e) => onFilterChange("difficulty", e.target.value)}
          value={filters.difficulty || ""}
          aria-label="Filter by difficulty"
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          onChange={(e) => onFilterChange("sort", e.target.value)}
          value={filters.sort || ""}
          aria-label="Sort recipes"
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Sort By</option>
          <option value="popular">Popular</option>
          <option value="trending">Trending</option>
          <option value="new">Newest</option>
        </select>

        <select
          onChange={(e) => onFilterChange("time_lt", e.target.value)}
          value={filters.time_lt || ""}
          aria-label="Filter by cooking time"
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

