import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ImageUpload from "./CloudinaryUpload";

const AdminShopPage = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    keywords: "",
    stock: "",
    images: [],
  });

  const getProducts = () => {
    axios
      .get("http://localhost:3050/shop")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (imageUrls) => {
    setForm({ ...form, images: imageUrls });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(",").map((k) => k.trim()),
      };
      await axios.post("http://localhost:3050/shop/products/add", payload);
      getProducts();
      setIsOpen(false);
      setForm({
        title: "",
        price: "",
        category: "",
        description: "",
        keywords: "",
        stock: "",
        images: [],
      });
    } catch (err) {
      console.error("Add product error", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3050/shop/products/delete/${id}`);
      getProducts();
      console.log("Product deleted successfully");
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="p-6">
      {/* Add Product Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Add Product
      </button>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form
              onSubmit={addProduct}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                "title",
                "price",
                "category",
                "description",
                "keywords",
                "stock",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="p-2 border rounded"
                />
              ))}

              {/* Image Upload */}
              <div className="md:col-span-2">
                <ImageUpload onImagesUploaded={handleImageUpload} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="md:col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow relative">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover rounded"
            />
            <Link to={`/product/${product._id}`} className="text-xl font-semibold mt-2 block">
              {product.title}
            </Link>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-green-600 font-bold">{product.price}€</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
              {/* Optional edit button */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShopPage;
