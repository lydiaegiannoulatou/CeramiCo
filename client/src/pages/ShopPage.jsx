import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

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
    "Mugs", "Bowls", "Plates", "Vases", "Teapots", "Jugs",
    "Sculptures", "Pitchers", "Candle Holders", "Planters",
  ];

  const keywordsList = [
    "Mug", "Bowl", "Plate", "Vase", "Ceramic", "Handmade",
    "Pottery", "Clay", "Rustic", "Unique", "Modern", "Decorative",
    "Animal", "Marble", "Painted", "Natural",
  ];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      setCurrentPage(1);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = products.filter((product) => {
      const searchFields = [
        product.title,
        product.description,
        product.category,
        ...(product.keywords || []),
      ].filter(Boolean);

      return searchFields.some((field) =>
        field.toString().toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
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
        toast.success(`${quantity} ${quantity === 1 ? "item" : "items"} added to cart!`);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2F4138] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#2F4138] font-medium">Loading our artisanal collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]">
        <div className="text-center text-[#8B3E2F] py-10">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display text-[#2F4138] mb-4">Our Collection</h1>
          <p className="text-[#5C6760] max-w-2xl mx-auto">
            Discover our handcrafted ceramics, each piece telling its own unique story
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search our collection..."
                className="w-full px-6 py-4 pl-14 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-[#2F4138]/10 focus:outline-none focus:ring-2 focus:ring-[#3C685A] transition-all duration-300"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#3C685A]" size={20} />
            </div>
            {searchTerm && (
              <p className="text-center mt-4 text-[#5C6760]">
                Found {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
              </p>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
<div
  key={product._id}
  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-[#2F4138]/10 transition-all duration-500 hover:shadow-xl hover:scale-[1.02]"
>
  {/* Out of Stock Overlay */}
  {product.stock <= 0 && (
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded-2xl">
      <span className="text-white font-bold text-lg uppercase tracking-wide">
        Out of Stock
      </span>
    </div>
  )}

  <Link
    to={`/product/${product._id}`}
    className="block aspect-square overflow-hidden"
  >
    <img
      src={product.images?.[0] || "/placeholder-image.jpg"}
      alt={product.title}
      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
        product.stock <= 0 ? "opacity-50" : ""
      }`}
    />
  </Link>

  <div className="p-6 relative z-20">
    <Link to={`/product/${product._id}`}>
      <h3 className="text-xl font-medium text-[#2F4138] mb-2 line-clamp-1 group-hover:text-[#3C685A] transition-colors">
        {product.title}
      </h3>
      <p className="text-2xl font-light text-[#3C685A]">
        €{product.price.toFixed(2)}
      </p>
    </Link>

    {token && !isAdmin && product.stock > 0 && (
      <button
        onClick={() => handleOpenCartModal(product)}
        className="mt-4 w-full py-3 bg-[#2F4138] text-white rounded-full flex items-center justify-center space-x-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#3C685A]"
      >
        <ShoppingCart size={18} />
        <span>Add to Cart</span>
      </button>
    )}

    {isAdmin && (
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={(e) => handleUpdate(e, product)}
          className="p-2 bg-[#2F4138] text-white rounded-full shadow-sm hover:bg-[#3C685A] transition-all duration-300"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={(e) => handleDelete(e, product._id)}
          className="p-2 bg-[#8B3E2F] text-white rounded-full shadow-sm hover:bg-[#A04B3C] transition-all duration-300"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )}
  </div>
</div>

          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#2F4138] text-xl mb-2">No pieces found</p>
            <p className="text-[#5C6760]">Try different search terms</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center space-x-3">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#2F4138]/10 text-[#2F4138] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2F4138] hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => paginate(idx + 1)}
                  className={`w-10 h-10 rounded-full font-medium transition-all duration-300 ${
                    currentPage === idx + 1
                      ? "bg-[#2F4138] text-white"
                      : "bg-white/80 backdrop-blur-sm border border-[#2F4138]/10 text-[#2F4138] hover:bg-[#2F4138] hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#2F4138]/10 text-[#2F4138] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2F4138] hover:text-white transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {isAdmin && (
          <button
            onClick={handleOpenModal}
            className="fixed bottom-8 right-8 bg-[#2F4138] text-white p-4 rounded-full shadow-lg hover:bg-[#3C685A] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            + Add Product
          </button>
        )}

        {/* Modals */}
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