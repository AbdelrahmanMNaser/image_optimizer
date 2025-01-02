import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import NotificationMessage from "../components/NotificationMessage";
import Axios from "../axiosConfig";
import ImageCard from "../components/ImageCard";
import { handleImageDownload } from "../services/Download";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
  });
  const [selectedImage, setSelectedImage] = useState("original");
  const [rotatedImages, setRotatedImages] = useState({});
  const [originalSize, setOriginalSize] = useState(null);
  const [needsOptimization, setNeedsOptimization] = useState(false);
  const [compressionData, setCompressionData] = useState(null);
  const [startCompression, setStartCompression] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [currentQuality, setCurrentQuality] = useState(null);
  const qualities = [25, 50, 75];

  useEffect(() => {
    const checkImageSize = async () => {
      if (!state?.filename) {
        navigate("/upload");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("filename", state.filename);

        const sizeResponse = await Axios.post("/check-size", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 20000,
        });

        setNeedsOptimization(sizeResponse.data.needs_optimization);
        setOriginalSize(parseFloat(sizeResponse.data.file_size, 2));

        setNotificationData({
          title: sizeResponse.data.needs_optimization
            ? "Image Needs Optimization"
            : "Image Looks Great!",
          message: sizeResponse.data.needs_optimization
            ? "Your image is larger than 2MB. We recommend optimizing it."
            : "Nice! Your image is already well optimized! 😊",
        });
        setShowNotification(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkImageSize();
  }, [state, navigate]);

  useEffect(() => {
    if (!startCompression) return;

    let isMounted = true;

    const compressImage = async () => {
      if (!state?.filename) return;

      setIsCompressing(true);
      setCompressionData({});

      try {
        const formData = new FormData();
        formData.append("filename", state.filename);

        const response = await Axios.post("/compress", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 500000,
        });

        if (!isMounted) return;

        setCompressionData(response.data.results);
        setNotificationData({
          title: "Compression Complete",
          message: "All images have been compressed successfully",
        });
        setShowNotification(true);
      } catch (error) {
        console.error("Compression error:", error);
        setNotificationData({
          title: "Compression Failed",
          message: "Failed to compress image. Please try again.",
        });
        setShowNotification(true);
      } finally {
        if (isMounted) {
          setIsCompressing(false);
          setCurrentQuality(null);
        }
      }
    };

    compressImage();

    return () => {
      isMounted = false;
    };
  
  }, [state?.filename, startCompression]);

  const handleRotate = async (quality) => {
    try {
      const formData = new FormData();
      formData.append("image", state.filename);

      const response = await Axios.post("/rotate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setRotatedImages((prev) => ({
          ...prev,
          [quality]: true,
        }));
      }
    } catch (error) {
      console.error("Rotation failed:", error);
    }
  };

  const getImageUrl = (quality) => {
    const name = state?.filename.split(".")[0];
    const ext = state?.filename.split(".")[1];
    return rotatedImages[quality]
      ? `http://localhost:5000/outputs/${name}_compressed_rotated.${ext}`
      : `http://localhost:5000/outputs/${name}_compressed_q${quality}.${ext}`;
  };

  const handleDownload = async () => {
    await handleImageDownload({
      selectedImage,
      compressionData,
      filename: state?.filename,
      onSuccess: () => { navigate("/"); },
      onError: (error) => {
        console.error("Download error:", error);
      },
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-8">
        <NotificationMessage
          title={notificationData.title}
          message={notificationData.message}
          isVisible={showNotification}
          onClose={() => {
            setShowNotification(false);
            if (needsOptimization) setStartCompression(true);
          }}
        />

        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Image Optimization Result
          </h1>

          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Original Image Size: {originalSize / (1024 * 1024)} MB
          </h3>

          {isCompressing ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Compressing your image...</p>
            </div>
          ) : (
            <div className="flex justify-center gap-8 mb-12">
              {qualities.map((quality) => (
                <ImageCard
                  key={quality}
                  image={getImageUrl(quality)}
                  percentage={quality}
                  isSelected={selectedImage === `compressed_${quality}`}
                  onClick={() => setSelectedImage(`compressed_${quality}`)}
                  fileSize={compressionData?.[quality]?.compressed_size}
                  sizeReductionPercentage={
                    compressionData?.[quality]?.compression_ratio
                  }
                  onRotate={() => handleRotate(quality)}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleDownload}
              disabled={isCompressing || !selectedImage}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg
               hover:bg-blue-600 transition-colors shadow-lg
               disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download Optimized
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
