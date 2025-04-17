import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "./ProductList";
import AddProductModal from "./AddProductModal";

const AdminShopPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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

  const getProducts = () => {
    axios
      .get("http://localhost:3050/shop")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        keywords: form.keywords.map((k) => k.trim()),
      };

      if (selectedProduct) {
        await axios.put(
          `http://localhost:3050/shop/products/update/${selectedProduct._id}`,
          payload
        );
        console.log("Product updated successfully");
      } else {
        await axios.post("http://localhost:3050/shop/products/add", payload);
        console.log("Product added successfully");
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
      console.error("Submit product error", err);
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

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setForm({
      ...product,
      keywords: product.keywords || [],
      images: product.images || [],
    });
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      {/* Add Product Button */}
      <button
        onClick={() => {
          setSelectedProduct(null); // Clear any existing product on "Add"
          setForm({
            title: "",
            price: "",
            category: "",
            description: "",
            keywords: [],
            stock: "",
            images: [],
          });
          setIsOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Add Product
      </button>

      {/* Product List */}
      <ProductList
        products={products}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        isAdmin={true}
      />

      {/* Add/Edit Product Modal */}
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
        onFormChange={handleChange}
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminShopPage;
