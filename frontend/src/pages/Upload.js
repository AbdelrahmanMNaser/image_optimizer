import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "./../components/PageTransition";
import UploadInput from "../components/UploadInput";
import Axios from "../axiosConfig";

function Upload() {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState({
    file: null,
    preview: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (file) => {
    setImageData((prev) => ({
      ...prev,
      file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleNext = async () => {
    if (!imageData.file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", imageData.file);

    try {
      const response = await Axios.post("/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/result", {
        state: {
          filename: imageData.file.name,
          extension: response.data.extension,
          isValid: response.data.is_valid,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex h-screen z-30">
        <div className="w-full p-4 bg-gray-50 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {imageData.file ? (
              <div className="space-y-4">
                <img
                  src={imageData.preview}
                  alt="Preview"
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg
                             hover:bg-blue-600 transform hover:scale-105 
                             transition-all duration-200 shadow-lg
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Uploading..." : "Next →"}
                  </button>
                </div>
              </div>
            ) : (
              <UploadInput onImageSelect={handleImageSelect} />
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Upload;
