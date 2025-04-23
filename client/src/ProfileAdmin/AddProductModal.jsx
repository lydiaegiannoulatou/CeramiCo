import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ImageUpload from "../components/CloudinaryUpload";

const AddProductPage = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    keywords: [],
    stock: "",
    images: [],
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleImageUpload = (uploadedImages) => {
    setForm((prevForm) => ({
      ...prevForm,
      images: uploadedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add validation for required fields if necessary
    if (!form.title || !form.price || !form.category || !form.description || !form.stock || form.images.length === 0) {
      toast.error("Please fill in all fields and upload images.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3050/shop/products/add", 
        form
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        setForm({
          title: "",
          price: "",
          category: "",
          description: "",
          keywords: [],
          stock: "",
          images: [],
        }); // Reset the form after submission
      } else {
        toast.error(response.data.msg || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleFormChange}
          placeholder="Product Title"
          className="p-3 border rounded"
        />

        {/* Price */}
        <input
          name="price"
          value={form.price}
          onChange={handleFormChange}
          placeholder="Product Price"
          className="p-3 border rounded"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={form.category}
          onChange={handleFormChange}
          className="p-3 border rounded"
        >
          <option value="">Select Category</option>
          <option value="mugs">Mugs</option>
          <option value="plates">Plates</option>
          <option value="bowls">Bowls</option>
          <option value="vases">Vases</option>
          <option value="planters">Planters</option>
          <option value="teapots">Teapots</option>
          <option value="decor">Home Decor</option>
          <option value="kitchen">Kitchenware</option>
          <option value="sculptures">Sculptures</option>
          <option value="candles">Candle Holders</option>
        </select>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleFormChange}
          placeholder="Product Description"
          className="p-3 border rounded"
        />

        {/* Keywords */}
        <div className="md:col-span-2">
          <p className="font-semibold mb-2">Keywords</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Handmade",
              "Wheel-Thrown",
              "Slab",
              "Colorful",
              "Animals",
              "Glazed",
              "Pattern",
              "Limited Edition",
              "Decorative",
              "Functional",
            ].map((keyword) => (
              <label key={keyword} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  value={keyword}
                  checked={form.keywords.includes(keyword)}
                  onChange={(e) => {
                    const keyword = e.target.value;
                    setForm((prevForm) => {
                      const updatedKeywords = prevForm.keywords.includes(keyword)
                        ? prevForm.keywords.filter((k) => k !== keyword)
                        : [...prevForm.keywords, keyword];
                      return { ...prevForm, keywords: updatedKeywords };
                    });
                  }}
                  className="mr-2"
                />
                {keyword}
              </label>
            ))}
          </div>
        </div>

        {/* Stock */}
        <input
          name="stock"
          value={form.stock}
          onChange={handleFormChange}
          placeholder="Stock Quantity"
          className="p-3 border rounded"
        />

        {/* Image Upload */}
        <div className="md:col-span-2">
          <ImageUpload onImagesUploaded={handleImageUpload} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="md:col-span-2 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
