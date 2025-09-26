import React from 'react';
import { useState } from 'react';
import HomePage from './Pages/HomePage';
import ExplorePage from './Pages/ExplorePage';
import CreateRecipeForm from './Pages/CreateRecipeForm';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div>
      <nav className="text-center justify-center flex gap-6 p-4 bg-gray-100 font-semibold text-lg text-gray-700 border-transparent rounded-2xl">
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('explore')}>Explore</button>
        <button onClick={() => setPage('create')}>Create Recipe</button>
      </nav>

      {page === 'home' && <HomePage />}
      {page === 'explore' && <ExplorePage />}
      {page === 'create' && <CreateRecipeForm />}
    </div>
  );
}

export default App;
