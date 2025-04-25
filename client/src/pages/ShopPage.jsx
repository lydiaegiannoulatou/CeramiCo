import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Link} from "react-router-dom"
import { ShoppingCart, Search, Pencil, Trash2 } from "lucide-react";
import AddProductModal from "../components/AddProductModal";
import AddToCartModal from "../components/AddToCartModal";


const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      setFilteredProducts(res.data);
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

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = products.filter(product => {
      const searchFields = [
        product.title,
        product.description,
        product.category,
        ...(product.keywords || [])
      ].filter(Boolean);

      return searchFields.some(field => 
        field.toString().toLowerCase().includes(searchTermLower)
      );
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (images) => {
    setForm((prev) => ({ ...prev, images }));
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:3050/shop/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete product.");
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      const payload = {
        items: [
          {
            type: "product",
            quantity,
            product_id: productId,
          },
        ],
      };

      const response = await axios.post(
        "http://localhost:3050/cart/add-to-cart",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
        setIsCartModalOpen(false);
        setSelectedProduct(null);
      } else {
        toast.error(response.data.msg || "Failed to add to cart.");
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add item to cart. Please try again.");
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

  const handleUpdate = (e, product) => {
    e.preventDefault();
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

  const handleOpenCartModal = (product) => {
    setSelectedProduct(product);
    setIsCartModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1ece3]">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#e5dbc5] rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#713818] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#713818] font-medium text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1ece3]">
        <div className="text-center text-red-500 py-10">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ea] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 relative">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pl-12 bg-[#eee6d2] rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#713818] transition-all duration-300 placeholder:text-[#8a7563]"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#713818] opacity-70" size={20} />
          </div>
          {searchTerm && (
            <p className="text-center mt-4 text-[#8a7563]">
              Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-[#eee6d2] rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl group relative"
            >
              <Link
                to={`/product/${product._id}`}
                className="block relative overflow-hidden rounded-lg mb-4"
              >
                <img
                  src={product.images?.[0] || "/placeholder-image.jpg"}
                  alt={product.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {!isAdmin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenCartModal(product);
                    }}
                    className="absolute bottom-4 right-4 p-2 bg-[#713818] text-white rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#5a2c14]"
                  >
                    <ShoppingCart size={20} />
                  </button>
                )}
              </Link>

              <Link to={`/product/${product._id}`}>
                <h3 className="font-medium text-lg text-[#5b3b20] mb-2">{product.title}</h3>
                <p className="text-[#3f612d] font-semibold mb-2">€{product.price.toFixed(2)}</p>
              </Link>

              {isAdmin && (
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    onClick={(e) => handleUpdate(e, product)}
                    className="p-2 bg-[#713818] text-white rounded-full shadow-lg hover:bg-[#5a2c14] transition-all duration-300"
                    title="Edit product"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, product._id)}
                    className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300"
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
  
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#713818] text-lg mb-2">No products found</p>
            <p className="text-[#8a7563]">Try adjusting your search terms</p>
          </div>
        )}
  
        {isAdmin && (
          <button
            onClick={handleOpenModal}
            className="fixed bottom-8 right-8 bg-[#713818] text-white p-4 rounded-full shadow-lg hover:bg-[#5a2c14] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            + Add Product
          </button>
        )}
  
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
  
        {isCartModalOpen && selectedProduct && (
          <AddToCartModal
            isOpen={isCartModalOpen}
            onClose={() => {
              setIsCartModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
};

export default ShopPage;