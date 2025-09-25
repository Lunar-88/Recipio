import React from 'react';
import { useState } from 'react';
import HomePage from './Pages/HomePage';
import ExplorePage from './Pages/ExplorePage';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-100">
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('explore')}>Explore</button>
      </nav>

      {page === 'home' && <HomePage />}
      {page === 'explore' && <ExplorePage />}
    </div>
  );
}

export default App;
