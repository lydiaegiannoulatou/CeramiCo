import React, { useState } from "react";
import axios from "axios";

const CloudinaryUpload = ({
  onImagesUploaded,
  existingImagePublicIds = [],
}) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  
  // Get upload signature from backend and upload directly to Cloudinary
  const uploadImageToCloudinary = async (file) => {
  console.log("baseUrl", baseUrl);

    try {
      const sigRes = await axios.post(`${baseUrl}/gallery/sign`);
      const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const imageUrl = res.data.secure_url;
      const publicId = res.data.public_id;
      const transformedUrl = `${imageUrl}?w=500&h=500&fit=crop&auto=format&quality=auto`;

      return { transformedUrl, publicId };
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const deleteImageFromCloudinary = async (publicId) => {
    try {
      await axios.delete(`${baseUrl}/gallery/${publicId}`);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      return false;
    }
  };

  const checkForDuplicateImage = (file) => {
    return existingImagePublicIds.find((publicId) => publicId === file.name);
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);

    const imageUrls = [];
    const imagePublicIds = [];

    for (let file of files) {
      try {
        const existingPublicId = checkForDuplicateImage(file);
        if (existingPublicId) {
          await deleteImageFromCloudinary(existingPublicId);
        }

        const { transformedUrl, publicId } = await uploadImageToCloudinary(
          file
        );
        imageUrls.push(transformedUrl);
        imagePublicIds.push(publicId);
      } catch (error) {
        console.error("Error handling file:", error);
      }
    }

    setIsUploading(false);
    setImageFiles(imageUrls);
    setUploadedImages(imagePublicIds);
    onImagesUploaded(imageUrls);
  };

  const handleDeleteImage = async (publicId, index) => {
    const isDeleted = await deleteImageFromCloudinary(publicId);
    if (isDeleted) {
      const updatedImages = [...uploadedImages];
      updatedImages.splice(index, 1);
      setUploadedImages(updatedImages);

      const updatedUrls = [...imageFiles];
      updatedUrls.splice(index, 1);
      setImageFiles(updatedUrls);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        disabled={isUploading}
        className="p-2 border rounded"
      />
      {isUploading && <p>Uploading images...</p>}
      {imageFiles.length > 0 && (
        <div className="mt-4">
          <h3>Uploaded Images:</h3>
          <div className="flex space-x-4">
            {imageFiles.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`Uploaded ${idx}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  onClick={() => handleDeleteImage(uploadedImages[idx], idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
