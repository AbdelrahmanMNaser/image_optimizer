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
          relative border-3 border-dashed rounded-xl p-10
          transition-all duration-300 ease-in-out cursor-pointer
          min-h-[350px] flex flex-col items-center justify-center
          shadow-sm hover:shadow-md
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-102' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'}
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
          <div className="flex flex-col items-center">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 object-contain mb-4 rounded-lg shadow-md" 
            />
            <p className="text-blue-600 font-medium mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Image selected
            </p>
          </div>
        ) : (
          <>
            <div className="bg-blue-100 p-6 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload your image</h3>
            <p className="text-gray-600 text-center mb-4">
              Drag and drop your image here, or click to browse
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-100 py-2 px-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Supports: JPG, PNG, GIF, TIFF, BMP</span>
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 flex items-center text-red-500 bg-red-50 py-2 px-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadInput;