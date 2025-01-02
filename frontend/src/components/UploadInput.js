import React, { useState, useRef } from 'react';

const UploadInput = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/bmp'];

  const handleFile = (file) => {
    setError(null);
    if (!file) return;
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload JPG or PNG files only');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onImageSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onClick={() => inputRef.current.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 
          transition-all duration-200 ease-in-out cursor-pointer
          min-h-[300px] flex flex-col items-center justify-center
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        
        {preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-64 object-contain mb-4" 
          />
        ) : (
          <>
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-600 text-center">
              Drag and drop your image here, or click to select
              <br />
              <span className="text-sm text-gray-500">
                Supports: JPG, PNG
              </span>
            </p>
          </>
        )}

        {error && (
          <p className="text-red-500 mt-2 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export default UploadInput;