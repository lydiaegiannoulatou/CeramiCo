import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

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

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setError("No token found. Please log in.");

      try {
        const response = await axios.get("http://localhost:3050/cart/get-cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleUpdateQuantity = async (id, quantity) => {
    const token = localStorage.getItem("token");
    
    const cartItem = cart.items.find(item => item.product_id?._id === id || item.workshop_id?._id === id);
    
    if (!cartItem) {
      console.error(`Item with ID ${id} not found in cart.`);
      return; 
    }
        
    try {
      const res = await axios.put(
        "http://localhost:3050/cart/update-quantity",
        { product_id: id, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (res.status === 200) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  const handleRemoveItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete("http://localhost:3050/cart/remove-item", {
        headers: { Authorization: `Bearer ${token}` },
        data: { product_id: id },
      });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  const calculateItemPrice = (item) => {
    const itemData = item.type === "product" ? item.product_id : item.workshop_id;
    return itemData && typeof itemData.price === 'number' ? itemData.price * item.quantity : 0;
  };

  const calculateTotal = () => {
    return cart.items.reduce((acc, item) => acc + calculateItemPrice(item), 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    const totalCostInCents = Math.round(calculateTotal() * 100);

    const payload = {
      items: cart.items.map((item) => {
        const data = item.type === "product" ? item.product_id : item.workshop_id;
        return {
          id: data._id,
          quantity: item.quantity,
          price: data.price || 0,
          type: item.type,
        };
      }),
      shippingAddress,
      totalCost: totalCostInCents,
      currency: "EUR",
    };

    try {
      const res = await axios.post("http://localhost:3050/payment/checkout", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1ece3] text-[#713818] text-lg">
        Loading cart...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1ece3] text-red-600 text-lg">
        {error}
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1ece3] text-[#713818] text-center px-4">
        <img
          src="https://res.cloudinary.com/drszm8sem/image/upload/v1745565742/ChatGPT_Image_Apr_25_2025_10_21_20_AM_dbjgat.png"
          alt="Empty clay cart"
          className="max-w-md w-full mb-8"
        />
        <p className="text-[#5b3b20] mt-2 text-base italic">Let's fill it with something beautiful.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f7f4ea] py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Cart Summary */}
        <div className="bg-[#eee6d2] rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-serif mb-6 text-center text-[#713818]">My Shopping Cart</h2>
          <div className="space-y-6">
            {cart.items.map((item) => {
              const isProduct = item.type === "product";
              const product = isProduct ? item.product_id : item.workshop_id;

              if (!product) return null;

              const itemPrice = product.price || 0;
              const totalPrice = itemPrice * item.quantity;

              return (
                <div key={product._id} className="flex gap-4 items-center border-b pb-4 border-[#d3c5b0]">
                  <img
                    src={product.images?.[0] || "/placeholder-image.jpg"}
                    alt={product.title || product.classTitle || "Item"}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-[#5b3b20]">
                      {product.title || product.classTitle}
                    </h3>
                    <p className="text-sm text-gray-600 italic">€{itemPrice.toFixed(2)}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                        className="text-[#713818] hover:text-[#a16038] disabled:opacity-30"
                      >
                        <FaArrowDown />
                      </button>
                      <span className="text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                        className="text-[#713818] hover:text-[#a16038]"
                      >
                        <FaArrowUp />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#3f612d] font-semibold">
                      €{totalPrice.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(product._id)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 mt-6 border-t border-[#d3c5b0] text-2xl font-serif font-bold text-right text-[#713818]">
            Total: €{calculateTotal().toFixed(2)}
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-[#eee6d2] rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-serif text-center mb-6 text-[#713818]">Shipping Details</h2>
          <form className="space-y-5">
            {[
              { name: "fullName", label: "Full Name" },
              { name: "addressLine1", label: "Address Line 1" },
              { name: "addressLine2", label: "Address Line 2 (optional)" },
              { name: "city", label: "City" },
              { name: "postalCode", label: "Postal Code" },
              { name: "country", label: "Country" },
              { name: "phone", label: "Phone" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-[#5b3b20] mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={shippingAddress[name]}
                  onChange={handleInputChange}
                  required={name !== "addressLine2"}
                  className="w-full px-3 py-2 border-b border-[#c4b49e] bg-transparent placeholder:text-gray-500 focus:outline-none focus:border-[#713818]"
                />
              </div>
            ))}
          </form>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="mt-8 w-full bg-[#713818] text-white font-semibold py-3 rounded-xl hover:bg-[#5a2c14] transition duration-300 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartAndCheckout;