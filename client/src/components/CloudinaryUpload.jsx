import React, { useState } from "react";
import axios from "axios";

const CloudinaryUpload = ({
  onImagesUploaded,
  existingImagePublicIds = [],
  folder = "Gallery",
}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const uploadImageToCloudinary = async (file) => {
    try {
      const token = localStorage.getItem("token");
      const sigRes = await axios.post(
        `${baseUrl}/gallery/sign`,
        { folder: "Products" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { timestamp, signature, apiKey, cloudName } = sigRes.data;

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

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);

    const newUploads = [];

    for (let file of files) {
      try {
        const duplicate = existingImagePublicIds.includes(file.name);
        if (duplicate) {
          await deleteImageFromCloudinary(file.name);
        }

        const { transformedUrl, publicId } = await uploadImageToCloudinary(file);
        newUploads.push({ url: transformedUrl, publicId });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setUploadedImages((prev) => [...prev, ...newUploads]);
    onImagesUploaded(newUploads.map((img) => img.url));
    setIsUploading(false);
  };

  const handleDeleteImage = async (publicId) => {
    const isDeleted = await deleteImageFromCloudinary(publicId);
    if (isDeleted) {
      const updated = uploadedImages.filter((img) => img.publicId !== publicId);
      setUploadedImages(updated);
      onImagesUploaded(updated.map((img) => img.url));
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload Input */}
      <label className="block">
        <span className="text-gray-700 font-medium">Upload Images</span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
          className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                     cursor-pointer disabled:opacity-50"
        />
      </label>

      {/* Uploading Indicator */}
      {isUploading && (
        <div className="flex items-center space-x-2 text-blue-600 text-sm">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Uploading images...</span>
        </div>
      )}

      {/* Image Grid*/}
      {uploadedImages.length > 0 && (
        <div>
          <h3 className="text-gray-800 font-semibold mb-2">Uploaded Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map(({ url, publicId }, idx) => (
              <div
                key={publicId}
                className="relative group overflow-hidden rounded-xl border shadow-sm"
              >
                <img
                  src={url}
                  alt={`Uploaded ${idx}`}
                  className="w-full h-32 object-cover"
                  title={publicId}
                />
                <button
                  onClick={() => handleDeleteImage(publicId)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
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