import React from "react";
import { X, Plus } from "lucide-react";

const InstructionStep = ({ steps, setSteps }) => {
  const handleChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));

  return (
    <div>
      <label className="block font-medium mb-2">Instructions</label>
      {steps.map((step, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <textarea
            placeholder={`Step ${index + 1}`}
            className="flex-1 border rounded px-2 py-1"
            value={step}
            onChange={(e) => handleChange(index, e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => removeStep(index)}
            className="text-red-500 hover:text-red-700 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addStep}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
      >
        <Plus size={16} /> Add Step
      </button>
    </div>
  );
};

export default InstructionStep;
