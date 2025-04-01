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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden px-4 sm:px-6 lg:px-8">
      <PageTransition>
        <div
          className={`w-full max-w-5xl flex flex-col items-center ${
            isNavigating ? "animate-slideOut" : ""
          }`}
        >
          <div className="relative mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Image Optimizer
            </h1>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></div>
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl text-center mb-12 max-w-3xl text-gray-700 leading-relaxed">
            Transform your images instantly with our powerful optimization
            tools. Reduce size, rotate, and enhance your images with just a few
            clicks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Process images in seconds with our optimized algorithms"
              },
              {
                icon: "🔒",
                title: "Secure",
                description: "Your images are processed locally and never stored on our servers"
              },
              {
                icon: "✨",
                title: "High Quality",
                description: "Maintain visual quality while reducing file size"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleGetStarted}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full
                     text-xl font-medium hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 
                     transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
          >
            Get Started 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </PageTransition>
    </div>
  );
};

export default Home;