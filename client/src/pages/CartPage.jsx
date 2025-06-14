import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Truck, 
  CreditCard,
  User,
  Home,
  Building,
  Mail,
  Globe,
  Phone,
  Package
} from "lucide-react";
import { toast } from "react-toastify";

const CartAndCheckout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setError("No token found. Please log in.");

      try {
        const response = await axios.get(
          `${baseUrl}/cart/get-cart`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCart(response.data.cart || { items: [] });
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to fetch cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    const token = localStorage.getItem("token");
    const cartItem = cart.items.find(
      (item) => item.product_id?._id === id || item.workshop_id?._id === id
    );

    console.log("cart item", cartItem);
    
    if (!cartItem) return;

    const product = cartItem.product_id;
    console.log("product",product);
    console.log("product stock", product.stock);
    
    
    if (!product) return;

    // Check if out of stock
    if (product.stock === 0) {
      toast.error("This item is out of stock");
      return;
    }

    // Validate quantity against stock
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    
    if (newQuantity > product.stock) {
      toast.error(`Only ${product.stock} ${product.stock === 1 ? 'item' : 'items'} available in stock`);
      return;
    }

    try {
      const res = await axios.put(
        `${baseUrl}/cart/update-quantity`,
        { product_id: id, quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        setCart(res.data.cart);
        toast.dismiss(); 
        toast.success("Cart updated successfully");
      }
    } catch (err) {
      console.error("Update quantity error:", err);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`${baseUrl}/cart/remove-item`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { product_id: id },
      });
      setCart(res.data.cart);
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Remove item error:", err);
      toast.error("Failed to remove item");
    }
  };

  const calculateItemPrice = (item) => {
    const itemData = item.product_id;
    if (!itemData) return 0;
    return itemData.price * item.quantity;
  };

  const calculateTotal = () => {
    return cart.items.reduce((acc, item) => acc + calculateItemPrice(item), 0);
  };

  const handleCheckout = async () => {
    // Validate all required shipping fields
    const requiredFields = ["fullName", "addressLine1", "city", "postalCode", "country", "phone"];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required shipping details");
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem("token");
    
    // Validate stock levels before checkout
    const invalidItems = cart.items.filter(item => {
      const product = item.product_id;
      if (!product) return false;
      return item.quantity > product.stock;
    });

    if (invalidItems.length > 0) {
      invalidItems.forEach(item => {
        const product = item.product_id;
        toast.error(`Only ${product.stock} ${product.stock === 1 ? 'item' : 'items'} available for ${product.title}`);
      });
      setIsProcessing(false);
      return;
    }
    
    const payload = {
      items: cart.items.map((item) => ({
        type: item.product_id ? "product" : "workshop",
        id: item.product_id?._id || item.workshop_id?._id,
        quantity: item.quantity,
        sessionId: item.session_id,
      })),
      shippingAddress,
    };

    try {
      const res = await axios.post(
       `${baseUrl}/payment/checkout`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to process checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2F4138] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#2F4138] font-medium">Loading your cart...</p>
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f2eb] px-4">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-24 h-24 text-[#2F4138]/20 mx-auto mb-6" />
          <h2 className="text-2xl font-display text-[#2F4138] mb-4">Your Cart is Empty</h2>
          <p className="text-[#5C6760] mb-8">Time to fill it with some handcrafted treasures.</p>
          <a
            href="/shop"
            className="inline-block bg-[#2F4138] text-white px-8 py-3 rounded-full hover:bg-[#3C685A] transition-colors duration-300"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display text-[#2F4138] text-center mb-12">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-[#2F4138]/10">
              {cart.items.map((item) => {
                const product = item.product_id;
                if (!product) return null;

                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock <= 5 && product.stock > 0;
                
                let stockMessage = "";
                let stockColor = "";
                
                if (isOutOfStock) {
                  stockMessage = "Out of stock";
                  stockColor = "text-red-600";
                } else if (isLowStock) {
                  stockMessage = `Only ${product.stock} ${product.stock === 1 ? 'item' : 'items'} left`;
                  stockColor = "text-[#8B4513]";
                } else {
                  stockMessage = `${product.stock} items available`;
                  stockColor = "text-[#3C685A]";
                }

                return (
                  <div
                    key={product._id}
                    className="flex gap-6 py-6 border-b border-[#2F4138]/10 last:border-0"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-[#2F4138]/10">
                      <img
                        src={product.images?.[0] || "/placeholder-image.jpg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-[#2F4138] mb-2">
                        {product.title}
                      </h3>
                      <p className="text-[#3C685A] mb-4">€{product.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isOutOfStock}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5f2eb] text-[#2F4138] hover:bg-[#2F4138] hover:text-white disabled:opacity-50 disabled:hover:bg-[#f5f2eb] disabled:hover:text-[#2F4138] transition-all duration-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium text-[#2F4138]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                          disabled={isOutOfStock || item.quantity >= product.stock}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5f2eb] text-[#2F4138] hover:bg-[#2F4138] hover:text-white disabled:opacity-50 disabled:hover:bg-[#f5f2eb] disabled:hover:text-[#2F4138] transition-all duration-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Stock status */}
                      <div className={`flex items-center gap-1.5 mt-2 text-sm ${stockColor}`}>
                        <Package size={14} />
                        <span>{stockMessage}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-medium text-[#2F4138] mb-4">
                        €{(product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(product._id)}
                        className="text-[#8B3E2F] hover:text-[#A04B3C] transition-colors duration-200"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-[#2F4138]/10">
              <h2 className="text-2xl font-display text-[#2F4138] mb-6">Shipping Details</h2>
              
              <form className="space-y-4">
                {[
                  { name: "fullName", label: "Full Name", icon: User },
                  { name: "addressLine1", label: "Address Line 1", icon: Home },
                  { name: "addressLine2", label: "Address Line 2 (optional)", icon: Building },
                  { name: "city", label: "City", icon: Building },
                  { name: "postalCode", label: "Postal Code", icon: Mail },
                  { name: "country", label: "Country", icon: Globe },
                  { name: "phone", label: "Phone", icon: Phone },
               // eslint-disable-next-line no-unused-vars
                ].map(({ name, label, icon: Icon }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-[#5C6760] mb-1">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2F4138]/40" />
                      <input
                        type="text"
                        name={name}
                        value={shippingAddress[name]}
                        onChange={handleInputChange}
                        required={name !== "addressLine2"}
                        className="w-full pl-10 pr-4 py-2 bg-[#f5f2eb] rounded-lg border border-[#2F4138]/10 focus:outline-none focus:ring-2 focus:ring-[#3C685A] transition-all duration-200"
                      />
                    </div>
                  </div>
                ))}
              </form>

              <div className="mt-8 pt-6 border-t border-[#2F4138]/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#5C6760]">Subtotal</span>
                  <span className="text-[#2F4138] font-medium">€{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#5C6760]">Shipping</span>
                  <span className="text-[#2F4138] font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center text-lg font-medium mb-8">
                  <span className="text-[#2F4138]">Total</span>
                  <span className="text-[#3C685A]">€{calculateTotal().toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-[#2F4138] text-white py-4 rounded-xl font-medium hover:bg-[#3C685A] transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-[#2F4138] disabled:transform-none"
                >
                  <CreditCard size={20} />
                  <span>{isProcessing ? "Processing..." : "Proceed to Payment"}</span>
                </button>

                <div className="mt-4 flex items-center justify-center text-sm text-[#5C6760]">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Free shipping on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartAndCheckout;