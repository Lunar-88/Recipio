import React from "react";
import { X, Plus } from "lucide-react";

const IngredientInput = ({ ingredients, setIngredients }) => {
  const handleChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

  return (
    <div>
      <label className="block font-medium mb-2">Ingredients</label>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            className="flex-1 border rounded px-2 py-1"
            value={ingredient.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Quantity"
            className="w-20 border rounded px-2 py-1"
            value={ingredient.quantity}
            onChange={(e) => handleChange(index, "quantity", e.target.value)}
          />
          <input
            type="text"
            placeholder="Unit"
            className="w-20 border rounded px-2 py-1"
            value={ingredient.unit}
            onChange={(e) => handleChange(index, "unit", e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeIngredient(index)}
            className="text-red-500 hover:text-red-700 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addIngredient}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
      >
        <Plus size={16} /> Add Ingredient
      </button>
    </div>
  );
};

export default IngredientInput;
