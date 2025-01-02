import React from 'react';

const PageTransition = ({ children }) => {
  return (
    <div className="animate-slideIn absolute w-full h-full">
      {children}
    </div>
  );
};

export default PageTransition;