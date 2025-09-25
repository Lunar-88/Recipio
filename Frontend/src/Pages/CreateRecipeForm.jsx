
import React, { useState } from "react";
import IngredientInput from "../Components/IngredientInput.jsx";
import InstructionStep from "../Components/InstructionStep.jsx";
import ImageUpload from "../Components/ImageUpload.jsx";

const CreateRecipeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState([""]);
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || ingredients.length === 0 || steps.length === 0) {
      alert("Please fill in title, ingredients, and steps.");
      return;
    }
    console.log({ title, description, prepTime, cookTime, servings, ingredients, steps, image });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Create Recipe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Prep Time"
              className="border rounded px-3 py-2"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cook Time"
              className="border rounded px-3 py-2"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
            <input
              type="number"
              placeholder="Servings"
              className="border rounded px-3 py-2"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>

          <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
          <InstructionStep steps={steps} setSteps={setSteps} />
          <ImageUpload image={image} setImage={setImage} />

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              onClick={() => alert("Draft saved!")}
            >
              Save Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeForm;
