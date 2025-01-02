import React, { useState } from "react";

const ImageCard = ({
  image,
  percentage,
  isSelected,
  onClick,
  fileSize,
  sizeReductionPercentage,
  onRotate,
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleRotate = async (e) => {
    e.stopPropagation(); // Prevent triggering onClick of parent
    setIsRotating(true);
    await onRotate();
    setIsRotating(false);
  };

  return (
    <div
      onClick={onClick}
      className={`w-1/3 p-4 cursor-pointer transition-all duration-300 hover:scale-105
               ${isSelected ? "ring-4 ring-blue-200 ring-offset-4" : ""}`}
    >
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Rotate Button */}
        <button
          onClick={handleRotate}
          disabled={isRotating}
          className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full 
                 shadow-lg hover:bg-gray-100 transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔄
        </button>
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Percentage Circle */}
          <div className="absolute top-4 left-4 z-10">
            <div
              className="flex items-center justify-center w-12 h-12 bg-white 
                        rounded-full shadow-lg border-2 border-gray-100"
            >
              <span className="text-sm font-semibold text-gray-700">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative aspect-square">
            <img
              src={image}
              alt={`Compressed ${percentage}%`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Selection Overlay */}
          {isSelected && (
            <div
              className="absolute inset-0 bg-blue-500/10 
                        border-4 border-blue-500 rounded-xl"
            />
          )}
          {/* File Size */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="bg-white px-3 py-1 rounded-full shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                {(fileSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>

          {/* File size Reduction Percentage  */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-white px-3 py-1 rounded-full shadow-lg">
              Size:
              <span className="text-sm font-medium text-red-600">
                {sizeReductionPercentage}% 🔻
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
