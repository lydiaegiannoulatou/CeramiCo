import React, { useState } from "react";
import axios from "axios";

const ImageUpload = ({ onImagesUploaded }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Upload image to Cloudinary and apply transformations via URL
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pottery_pics"); // cloudinary preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/drszm8sem/image/upload",
        formData
      );

      // Applying transformations (resize to 500x500, format auto, quality auto)
      const imageUrl = res.data.secure_url;
      const publicId = res.data.public_id;
      const transformedUrl = `${imageUrl}?w=500&h=500&fit=crop&auto=format&quality=auto`;

      return { transformedUrl, publicId }; // Return both URL and publicId
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    const imageUrls = [];
    const imagePublicIds = [];

    for (let file of files) {
      try {
        const { transformedUrl, publicId } = await uploadImageToCloudinary(file);
        imageUrls.push(transformedUrl);
        imagePublicIds.push(publicId);
      } catch (error) {
        console.error("Error uploading file", error);
      }
    }

    setIsUploading(false);
    setImageFiles(imageUrls); // Store uploaded image URLs
    setUploadedImages(imagePublicIds); // Store uploaded image public IDs
    onImagesUploaded(imageUrls); // Pass URLs back to the parent component
  };

  // Delete image from Cloudinary
  const deleteImageFromCloudinary = async (publicId) => {
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/drszm8sem/image/destroy`,
        {
          public_id: publicId,
        }
      );

      // Check if the deletion was successful
      if (response.data.result === "ok") {
        console.log(`Image with public_id ${publicId} deleted successfully.`);
        return true; // Deletion successful
      } else {
        console.error("Image deletion failed:", response.data);
        return false; // Deletion failed
      }
    } catch (error) {
      console.error("Error deleting image", error);
      return false; // Error during deletion
    }
  };

  const handleDeleteImage = async (publicId, index) => {
    const isDeleted = await deleteImageFromCloudinary(publicId); // Wait for deletion to complete

    if (isDeleted) {
      // Remove the image from the local state
      const updatedImages = [...uploadedImages];
      updatedImages.splice(index, 1); // Remove image from the state
      setUploadedImages(updatedImages);

      const updatedUrls = [...imageFiles];
      updatedUrls.splice(index, 1); // Remove URL from the state
      setImageFiles(updatedUrls);
    } else {
      alert("Failed to delete the image. Please try again.");
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
                  onClick={() => handleDeleteImage(uploadedImages[idx], idx)} // Pass publicId and index
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

export default ImageUpload;
