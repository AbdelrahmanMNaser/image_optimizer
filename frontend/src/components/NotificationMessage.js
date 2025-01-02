import React from 'react';

const NotificationMessage = ({ title, message, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-500/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative
                    transform transition-all duration-300 ease-in-out
                    animate-fadeIn">
        <div className="p-6">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {title}
          </h2>
          
          {/* Message */}
          <p className="text-gray-600 mb-8">
            {message}
          </p>
          
          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg
                       hover:bg-blue-600 transform hover:scale-105 
                       transition-all duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationMessage;