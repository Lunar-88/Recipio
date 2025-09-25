
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors 
          ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          disabled={p === currentPage}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors 
            ${
              p === currentPage
                ? "bg-blue-600 text-white cursor-default"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors 
          ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
