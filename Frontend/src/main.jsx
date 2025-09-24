import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import './index.css'
import App from "./App.jsx"
import FavoritesButton from "./Components/FavoritesButton.jsx";
import Pagination from "./Components/Pagination.jsx";
import RecipeCard from "./Components/RecipeCard.jsx";
import HomePage from "./Pages/HomePage.jsx"
import SearchFilter from "./Components/SearchFilter.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <FavoritesButton />
    <Pagination />
    
    
    <SearchFilter />
  
  </StrictMode>
);
