import React from "react";
import ImageUpload from "./CloudinaryUpload";

const AddProductModal = ({
  isOpen,
  onClose,
  form,
  setForm,
  categories,
  keywordsList,
  onFormChange,
  onImageUpload,
  onSubmit,
}) => {
  const handleKeywordChange = (e) => {
    const keyword = e.target.value;
    setForm((prevForm) => {
      const updatedKeywords = prevForm.keywords.includes(keyword)
        ? prevForm.keywords.filter((k) => k !== keyword)
        : [...prevForm.keywords, keyword];
      return { ...prevForm, keywords: updatedKeywords };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}
          <input
            name="title"
            value={form.title}
            onChange={onFormChange}
            placeholder="Title"
            className="p-2 border rounded"
          />

          {/* Price */}
          <input
            name="price"
            value={form.price}
            onChange={onFormChange}
            placeholder="Price"
            className="p-2 border rounded"
          />

          {/* Category Dropdown */}
          <select
            name="category"
            value={form.category}
            onChange={onFormChange}
            className="p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Description */}
          <input
            name="description"
            value={form.description}
            onChange={onFormChange}
            placeholder="Description"
            className="p-2 border rounded"
          />

          {/* Keywords */}
          <div className="md:col-span-2">
            <p className="font-semibold mb-2">Keywords</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {keywordsList.map((keyword) => (
                <label key={keyword} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    value={keyword}
                    checked={form.keywords.includes(keyword)}
                    onChange={handleKeywordChange}
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
            onChange={onFormChange}
            placeholder="Stock"
            className="p-2 border rounded"
          />

          {/* Image Upload */}
          <div className="md:col-span-2">
            <ImageUpload onImagesUploaded={onImageUpload} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;