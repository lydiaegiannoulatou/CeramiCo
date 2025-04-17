import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxUpdate } from "react-icons/rx";
import { toast } from "react-toastify";
import AddProductModal from "../components/AddProductModal";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    keywords: [],
    stock: "",
    images: [],
  });

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("role") === "admin";

  const categories = [
    "Mugs", "Bowls", "Plates", "Vases", "Teapots",
    "Jugs", "Sculptures", "Pitchers", "Candle Holders", "Planters"
  ];

  const keywordsList = [
    "Mug", "Bowl", "Plate", "Vase", "Ceramic", "Handmade",
    "Pottery", "Clay", "Rustic", "Unique", "Modern",
    "Decorative", "Animal", "Marble", "Painted", "Natural"
  ];

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3050/shop", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
      setError("Could not load products.");
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (images) => {
    setForm((prev) => ({ ...prev, images }));
  };

// Handle delete product
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    await axios.delete(`http://localhost:3050/shop/products/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();  // Refresh the list
    toast.success("Product deleted.");
  } catch (err) {
    console.error("Delete failed:", err);
    toast.error("Failed to delete product.");
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    if (!payload.title || !payload.price || !payload.category || !payload.stock) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    try {
      if (selectedProduct) {
        await axios.put(
          `http://localhost:3050/shop/products/update/${selectedProduct._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post("http://localhost:3050/shop/products/add", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product added successfully!");
      }

      fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
      setForm({
        title: "",
        price: "",
        category: "",
        description: "",
        keywords: [],
        stock: "",
        images: [],
      });
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Failed to submit product.");
    }
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setForm(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setForm({
      title: "",
      price: "",
      category: "",
      description: "",
      keywords: [],
      stock: "",
      images: [],
    });
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-center w-full">Shop</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setIsModalOpen(true);
              setSelectedProduct(null);
              setForm({
                title: "",
                price: "",
                category: "",
                description: "",
                keywords: [],
                stock: "",
                images: [],
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ml-10"
          >
            Add Product
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-xl overflow-hidden hover:shadow-md transition duration-200 relative flex flex-col"
          >
            <div className="flex-1">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 text-sm">
                  {product.description?.slice(0, 100)}...
                </p>
                <p className="mt-2 text-lg font-bold">{`$${product.price}`}</p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex justify-end gap-2 p-3 mt-auto">
                <button
                  onClick={() => handleUpdate(product)}
                  className="border border-orange-500 text-orange-500 px-2 py-1 rounded hover:bg-orange-100 transition text-sm flex items-center gap-1"
                >
                  <RxUpdate />
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-100 transition text-sm flex items-center gap-1"
                >
                  <RiDeleteBin6Line />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          form={form}
          setForm={setForm}
          categories={categories}
          keywordsList={keywordsList}
          onFormChange={handleFormChange}
          onImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ShopPage;
