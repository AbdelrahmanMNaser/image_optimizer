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
      className={`w-1/3 p-3 cursor-pointer transition-all duration-300 transform hover:scale-[1.03]
                 ${isSelected ? "scale-[1.02]" : ""}`}
    >
      <div 
        className={`relative bg-white rounded-xl overflow-hidden shadow-md
                  ${isSelected ? "ring-4 ring-blue-500 shadow-lg" : "hover:shadow-lg"}`}
      >
        {/* Rotate Button */}
        <button
          onClick={handleRotate}
          disabled={isRotating}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full 
                   shadow-md hover:bg-blue-50 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
          title="Rotate image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-blue-600 ${isRotating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Image Container */}
        <div className="relative aspect-square">
          <img
            src={image}
            alt={`Compressed ${percentage}%`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quality Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md 
                         border-2 ${percentage >= 80 ? 'bg-green-50 border-green-200' : 
                                   percentage >= 50 ? 'bg-yellow-50 border-yellow-200' : 
                                   'bg-red-50 border-red-200'}`}
          >
            <span className={`text-sm font-bold ${
              percentage >= 80 ? 'text-green-700' : 
              percentage >= 50 ? 'text-yellow-700' : 
              'text-red-700'
            }`}>
              {percentage}%
            </span>
          </div>
        </div>

        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/10" />
        )}

        {/* Info Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between items-center">
          {/* Size Reduction */}
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            <span className="text-xs font-semibold text-gray-800">
              {sizeReductionPercentage}%
            </span>
          </div>
          
          {/* File Size */}
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-xs font-semibold text-gray-800">
              {(fileSize / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </div>

        {/* Selected Checkmark */}
        {isSelected && (
          <div className="absolute top-3 right-12 z-20 bg-blue-500 rounded-full p-1 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;