import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddProductModal from "../components/AddProductModal";
import ProductList from "../components/ProductList";

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

  const handleOpenModal = () => {
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
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <ProductList
        products={products}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        isAdmin={isAdmin}
        handleOpenModal={handleOpenModal} // fix for ProductList button
      />

      {isModalOpen && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
