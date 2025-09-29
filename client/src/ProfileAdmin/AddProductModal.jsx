import React, { useState } from "react";
import axios from "axios";
import ToastNotification from "../components/ToastNotification"
import ImageUpload from "../components/CloudinaryUpload";
import { FiCheckCircle } from "react-icons/fi";
import { Package, Tag, DollarSign, Boxes, Send, Loader2, AlertCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

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
    
    if (!form.title || !form.price || !form.category || !form.description || !form.stock || form.images.length === 0) {
      ToastNotification.notifyError("Please fill in all fields and upload at least one image.", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${baseUrl}/shop/products/add`, 
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        ToastNotification.notifySuccess("Product added successfully!", {
          icon: <FiCheckCircle className="w-5 h-5 text-green-500" />,
        });
        setForm({
          title: "",
          price: "",
          category: "",
          description: "",
          keywords: [],
          stock: "",
          images: [],
        });
      } else {
        ToastNotification.notifyError(response.data.msg || "Failed to add product.", {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      ToastNotification.notifyError("Something went wrong. Please try again later.", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="bg-[#2F4138]/5 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-medium text-[#2F4138] mb-3 sm:mb-4">Basic Information</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Enter product title"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Enter product description"
                rows="3"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20 text-sm sm:text-base resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Category and Price */}
        <div className="bg-[#2F4138]/5 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-medium text-[#2F4138] mb-3 sm:mb-4">Category and Price</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-[#2F4138]/10 
                  focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20 text-sm sm:text-base"
                required
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
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                Price (€)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleFormChange}
                placeholder="Enter price"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F4138] mb-2">
                <Boxes className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleFormChange}
                placeholder="Enter stock quantity"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-[#2F4138]/10 
                  placeholder:text-[#2F4138]/50 focus:outline-none focus:ring-2 focus:ring-[#2F4138]/20 text-sm sm:text-base"
                required
              />
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-[#2F4138]/5 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-[#2F4138] mb-3 sm:mb-4">
            <Tag className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Keywords
          </h3>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
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
              "Floral",
            ].map((keyword) => (
              <label key={keyword} className="flex items-center space-x-2 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  value={keyword}
                  checked={form.keywords.includes(keyword)}
                  onChange={(e) => {
                    const keyword = e.target.value;
                    setForm((prevForm) => ({
                      ...prevForm,
                      keywords: prevForm.keywords.includes(keyword)
                        ? prevForm.keywords.filter((k) => k !== keyword)
                        : [...prevForm.keywords, keyword],
                    }));
                  }}
                  className="rounded border-[#2F4138]/20 text-[#2F4138] focus:ring-[#2F4138]"
                />
                <span className="text-[#2F4138] break-words">{keyword}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-[#2F4138]/5 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-[#2F4138] mb-3 sm:mb-4">Product Images</h3>
          <ImageUpload onImagesUploaded={handleImageUpload} />
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end pt-4 gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-3 bg-[#2F4138] text-white rounded-lg sm:rounded-xl
              hover:bg-[#3A4F44] disabled:bg-[#2F4138]/20 disabled:cursor-not-allowed
              transition-colors duration-200 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;