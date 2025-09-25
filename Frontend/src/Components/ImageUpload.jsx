import React from "react";
import { UploadCloud } from "lucide-react";

const ImageUpload = ({ image, setImage }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div>
      <label className="block font-medium mb-1">Image</label>
      <label className="flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-md p-4 cursor-pointer hover:border-blue-500">
        <UploadCloud size={32} className="text-gray-400 mb-2" />
        <span className="text-gray-500">Drag & drop or click to upload</span>
        <input type="file" className="hidden" onChange={handleImageUpload} />
      </label>
      {image && <img src={image} alt="preview" className="mt-2 w-48 h-48 object-cover rounded" />}
    </div>
  );
};

export default ImageUpload;
