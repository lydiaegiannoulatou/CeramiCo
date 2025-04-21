import React, { useEffect, useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
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
      try {
        const res = await axios.get("http://localhost:3050/cart/get-cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCart(res.data.cart);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    const totalCostInCents = Math.round(
      cart.items.reduce((acc, item) => {
        const isProduct = item.type === "product";
        const price = isProduct ? item.product_id.price : item.workshop_id.price;
        return acc + item.quantity * price;
      }, 0) * 100
    );

    const payload = {
      items: cart.items.map((item) => {
        const isProduct = item.type === "product";
        return {
          id: isProduct ? item.product_id._id : item.workshop_id._id,
          quantity: item.quantity,
          price: isProduct ? item.product_id.price : item.workshop_id.price,
          type: item.type,
        };
      }),
      shippingAddress,
      totalCost: totalCostInCents,
      currency: "EUR",
    };

    console.log("Payload being sent to backend:", payload);

    try {
      const response = await axios.post(
        "http://localhost:3050/payment/checkout",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response", response);

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Error redirecting to Stripe Checkout:", err);
      alert("Checkout failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !cart)
    return <p className="text-center">Loading checkout...</p>;
  if (!cart.items || cart.items.length === 0) {
    return <p className="text-center">Your cart is empty.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 container mx-auto">
      {/* Left: Cart Summary */}
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cart.items.map((item) => {
          const isProduct = item.type === "product";
          const productOrWorkshop = isProduct ? item.product_id : item.workshop_id;

          if (!productOrWorkshop) {
            console.warn(
              `Missing ${isProduct ? "product_id" : "workshop_id"} for cart item:`,
              item
            );
            return null;
          }

          return (
            <div
              key={productOrWorkshop._id}
              className="flex items-center border-b py-4 gap-4"
            >
              <img
                src={productOrWorkshop.images?.[0] || "/placeholder-image.jpg"} // Fallback image
                alt={productOrWorkshop.title || productOrWorkshop.classTitle || "Item"}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold">
                  {productOrWorkshop.title || productOrWorkshop.classTitle || "Unknown Item"}
                </p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm font-medium">
                  Subtotal: €
                  {(item.quantity * productOrWorkshop.price || 0).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
        <p className="text-xl font-bold mt-4">
          Total: €
          {cart.items
            .reduce((acc, item) => {
              const isProduct = item.type === "product";
              const price = isProduct
                ? item.product_id.price
                : item.workshop_id.price;
              return acc + item.quantity * price;
            }, 0)
            .toFixed(2)}
        </p>
      </div>

      {/* Right: Shipping Form */}
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
        <form className="space-y-4">
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
              <label className="block font-medium">{label}</label>
              <input
                name={name}
                value={shippingAddress[name]}
                onChange={handleInputChange}
                required={name !== "addressLine2"}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </form>

        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
