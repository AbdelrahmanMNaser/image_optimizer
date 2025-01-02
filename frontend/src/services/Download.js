const getImageUrl = (filename, quality, isRotated) => {
  const name = filename.split(".")[0];
  const ext = filename.split(".")[1];
  return isRotated 
    ? `http://localhost:5000/outputs/${name}_compressed_rotated${ext}`
    : `http://localhost:5000/outputs/${name}_compressed_q${quality}.${ext}`;
};

export const handleImageDownload = async ({ selectedImage, compressionData, filename, onSuccess, onError }) => {
  if (!selectedImage || !compressionData) return;

  const quality = selectedImage.split("_")[1];
  const imageUrl = getImageUrl(filename, quality, compressionData.isRotated);

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `optimized_${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Download error:", error);
    if (onError) onError(error);
  }
};