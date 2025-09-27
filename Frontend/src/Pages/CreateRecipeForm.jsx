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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || ingredients.length === 0 || steps.length === 0) {
      alert("Please fill in title, ingredients, and steps.");
      return;
    }

    setLoading(true);

    try {
      let mediaId = null;

      // 1️⃣ Upload image first if exists
      if (image) {
        const formData = new FormData();
        // 💡 FIX: Change "file" to "image" to match the Flask backend's request.files.get("image")
        formData.append("image", image); // <--- THIS IS THE CRITICAL CHANGE

        const res = await fetch("https://recipio.onrender.com/api", {
          method: "POST",
          body: formData,
          // NOTE: DO NOT set Content-Type header when using FormData, 
          // the browser sets it automatically to multipart/form-data.
        });

        // The backend returns a 400 because it fails this check:
        // file_to_upload = request.files.get("image")
        // if not file_to_upload: return 400

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(`Image upload failed: ${errData.error}`);
        }
        
        const data = await res.json();
        // data.id is the Cloudinary public_id
        mediaId = data.id; 
      }

      // 2️⃣ Format ingredients for backend
      const formattedIngredients = ingredients.map((i) => ({
        ingredient: i.name, 
      }));

      // 3️⃣ Format instructions for backend
      const formattedSteps = steps.map((desc, index) => ({
        step_number: index + 1,
        description: desc,
      }));

      // 4️⃣ Submit recipe
      const recipeRes = await fetch("https://recipio.onrender.com/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          prep_time_minutes: prepTime ? parseInt(prepTime) : null,
          cook_time_minutes: cookTime ? parseInt(cookTime) : null,
          servings: servings ? parseInt(servings) : null,
          chef_id: 1, // replace with real user ID
          ingredients: formattedIngredients,
          instructions: formattedSteps,
          media_id: mediaId, // Cloudinary public_id
        }),
      });

      if (!recipeRes.ok) {
        const errData = await recipeRes.json();
        throw new Error(errData.error || "Recipe submission failed");
      }

      const recipeData = await recipeRes.json();
      alert("Recipe created successfully!");
      console.log(recipeData);

      // Reset form
      setTitle("");
      setDescription("");
      setPrepTime("");
      setCookTime("");
      setServings("");
      setIngredients([{ name: "", quantity: "", unit: "" }]);
      setSteps([""]);
      setImage(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error submitting recipe");
    } finally {
      setLoading(false);
    }
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
              placeholder="Prep Time (min)"
              className="border rounded px-3 py-2"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cook Time (min)"
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
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
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

