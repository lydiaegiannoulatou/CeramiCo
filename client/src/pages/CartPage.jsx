import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState(null); // Store the cart data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the cart when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      console.log("Token from localStorage:", token);

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3050/cart/get-cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("Response from cart API:", response.data);

        // Check for success message and retrieve cart
        if (response.data && response.data.cart) {
          setCart(response.data.cart); // Set the cart data
        } else {
          setError("Cart data not found.");
        }
      } catch (err) {
        console.log("Error fetching cart:", err);
        setError('Error fetching cart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return <div className="text-center py-6">Loading your cart...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  // If no cart data found or cart is empty
  if (!cart || cart.items.length === 0) {
    return <div className="text-center py-6">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {/* Cart items */}
      <div className="space-y-6">
        {cart.items.map((item) => {
          const { product_id, quantity } = item;
          return (
            <div
              key={product_id._id}
              className="flex items-center border-b pb-4 mb-4 last:mb-0 last:border-b-0"
            >
              <img
                src={product_id.images[0]} // Display the first image of the product
                alt={product_id.title}
                className="w-24 h-24 object-cover rounded-lg mr-6"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{product_id.title}</h2>
                <p className="text-lg text-gray-600">Price: €{product_id.price}</p>
                <p className="text-lg text-gray-600">Quantity: {quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  €{(product_id.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Price */}
      <div className="flex justify-between items-center py-4 mt-6 border-t">
        <h2 className="text-2xl font-semibold">Total:</h2>
        <p className="text-xl font-bold text-green-600">
          €{cart.items.reduce((acc, item) => acc + item.quantity * item.product_id.price, 0).toFixed(2)}
        </p>
      </div>

      {/* Checkout Button */}
      <div className="text-center mt-6">
        <button className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
