import React, { useState, useEffect } from "react";
import axios from "axios";

import ProductList from "../components/ProductList";
import AddProductModal from "../components/AddProductModal";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [token, setToken] = useState("");

  const [isOpen, setIsOpen] = useState(false);
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

  const categories = [
    "Mugs", "Bowls", "Plates", "Vases", "Teapots",
    "Jugs", "Sculptures", "Pitchers", "Candle Holders", "Planters"
  ];

  const keywordsList = [
    "Mug", "Bowl", "Plate", "Vase", "Ceramic", "Handmade",
    "Pottery", "Clay", "Rustic", "Unique", "Modern",
    "Decorative", "Animal", "Marble", "Painted", "Natural"
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3050/shop")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));

    const role = localStorage.getItem("role");
    const authToken = localStorage.getItem("token");
    setUserRole(role);
    setToken(authToken);
  }, []);

  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3050/shop");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetching products error", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3050/shop/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setForm({
      ...product,
      keywords: product.keywords || [],
      images: product.images || [],
    });
    setIsOpen(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (imageUrls) => {
    setForm({ ...form, images: imageUrls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      keywords: form.keywords.map((k) => k.trim()),
    };

    try {
      if (selectedProduct) {
        // Update existing
        await axios.put(
          `http://localhost:3050/shop/products/update/${selectedProduct._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Product updated");
      } else {
        // Add new (not used in this view, but can keep for future)
        await axios.post("http://localhost:3050/shop/products/add", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Product added");
      }

      getProducts();
      setIsOpen(false);
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
      console.error("Error submitting product", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <ProductList
        products={products}
        isAdmin={userRole === "admin"}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />

      {/* Admin-only Modal */}
      {userRole === "admin" && (
        <AddProductModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedProduct(null);
          }}
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
