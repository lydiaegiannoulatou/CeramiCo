import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel";
import AddToCart from "../components/AddToCart";
import QuantitySelector from "../components/QuantitySelector";
import { 
  Clock, 
  Check, 
  AlertCircle,
  Tag,
  Info
} from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3050/shop/product/${id}`)
      .then((res) => {
        setProduct(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching product", err);
        setError("Failed to load product. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });

    const role = localStorage.getItem("role");
    setUserRole(role || "");
  }, [id]);

  const getStockStatus = () => {
    if (!product) return null;
    
    if (product.stock === 0) {
      return (
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Out of Stock</span>
        </div>
      );
    } else if (product.stock < 5) {
      return (
        <div className="flex items-center text-amber-600">
          <Clock className="w-5 h-5 mr-2" />
          <span>Low Stock: Only {product.stock} left</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-green-600">
          <Check className="w-5 h-5 mr-2" />
          <span>In Stock</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ea] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#5b3b20] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#5b3b20] font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f7f4ea] py-10 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#5b3b20] mb-2">Product Not Found</h2>
          <p className="text-[#8a7563] mb-6">{error || "This product couldn't be loaded."}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[#5b3b20] text-white rounded-lg hover:bg-[#4a2e18] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ea] py-8 px-4 md:py-12">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-6 md:p-8 bg-[#f9f6f1]">
            <ImageCarousel images={product.images || []} />
          </div>

          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-[#5b3b20] mb-2 leading-tight">
                {product.title}
              </h1>
              
              <div className="mb-6">
                <div className="text-2xl font-bold text-[#3f612d]">
                  €{product.price.toFixed(2)}
                </div>
              </div>

              <div className="mb-6">
                {getStockStatus()}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#5b3b20] mb-2">Description</h2>
                <p className="text-[#8a7563]">{product.description}</p>
              </div>

              {product.keywords && product.keywords.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-2">
                    <Tag className="w-4 h-4 mr-2 text-[#5b3b20]" />
                    <h2 className="text-sm font-semibold text-[#5b3b20]">Tags</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.keywords.map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="inline-block bg-[#f1e8d8] text-[#5b3b20] px-3 py-1 rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#f1e8d8]">
       {userRole === "admin" ? (
  <div className="flex items-start space-x-2 bg-[#f9f6f1] p-4 rounded-lg">
    <Info className="w-5 h-5 text-[#8a7563] mt-0.5 flex-shrink-0" />
    <p className="text-[#8a7563] italic text-sm">
      As much as we admire your admin powers, adding products to the cart is a task reserved for regular users.
    </p>
  </div>
) : !localStorage.getItem("token") ? (
  <div className="flex items-start space-x-2 bg-[#fff3cd] border border-[#ffeeba] text-[#856404] p-4 rounded-lg">
    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
    <p className="italic text-sm">Please log in to add this product to your cart.</p>
  </div>
) : (
  <>
    {product.stock > 0 && (
      <div className="mb-6">
        <QuantitySelector 
          quantity={quantity}
          setQuantity={setQuantity}
          max={product.stock}
          label="Select Quantity"
        />
      </div>
    )}
    <div className="flex flex-col sm:flex-row gap-4">
      <AddToCart
        item={product}
        quantity={quantity}
        showLabel={true}
      />
    </div>
  </>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;