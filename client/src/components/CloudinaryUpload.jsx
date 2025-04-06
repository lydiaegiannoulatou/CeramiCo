import React, { useState } from "react";
import axios from "axios";

const ImageUpload = ({ onImagesUploaded }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
      const transformedUrl = `${imageUrl}?w=500&h=500&fit=crop&auto=format&quality=auto`;

      return transformedUrl; // Return the transformed URL
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    const imageUrls = [];

    for (let file of files) {
      try {
        const url = await uploadImageToCloudinary(file);
        imageUrls.push(url);
      } catch (error) {
        console.error("Error uploading file", error);
      }
    }

    setIsUploading(false);
    setImageFiles(imageUrls); // Store uploaded image URLs
    onImagesUploaded(imageUrls); // Pass URLs back to the parent component
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
              <img
                key={idx}
                src={url}
                alt={`Uploaded ${idx}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
