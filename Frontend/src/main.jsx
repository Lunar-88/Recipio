import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import './index.css'
import App from "./App.jsx"
import SearchFilter from "./Components/SearchFilter.jsx"
import Pagination from "./Components/Pagination.jsx"
import RecipeCard from "./Components/RecipeCard.jsx"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchFilter />
    <Pagination />
    <RecipeCard />
  </StrictMode>,
)
