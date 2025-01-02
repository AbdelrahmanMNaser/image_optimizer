import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const Home = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGetStarted = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate("/upload");
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8">
      <PageTransition>
        <div
          className={`w-full flex flex-col items-center ${
            isNavigating ? "animate-slideOut" : ""
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 font-bold text-gray-800">
            Image Optimizer
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-center mb-12 max-w-2xl text-gray-600">
            Transform your images instantly with our powerful optimization
            tools. Reduce size, rotate, and enhance your images with just few
            clicks.
          </p>

          <button
            onClick={handleGetStarted}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 text-white rounded-xl 
                     text-lg sm:text-xl hover:bg-blue-600 transform hover:scale-105 
                     transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started →
          </button>
        </div>
      </PageTransition>
    </div>
  );
};

export default Home;
