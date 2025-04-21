import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');

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

        if (response.data && response.data.cart) {
          setCart(response.data.cart);
        } else {
          setCart({ items: [] });
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError('Error fetching cart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return <div className="text-center py-6">Loading your cart...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div className="text-center py-6">Your cart is empty.</div>;
  }

  const handleUpdateQuantity = async (id, quantity, type) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:3050/cart/update-quantity',
        {
          id,
          quantity,
          type,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.cart) {
        setCart(response.data.cart);
      } else {
        setError('Failed to update item quantity.');
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError('There was an error updating the quantity.');
    }
  };

  const handleRemoveItem = async (id, type) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const response = await axios.delete('http://localhost:3050/cart/remove-item', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          id,
          type,
        },
      });

      if (response.data.cart) {
        setCart(response.data.cart);
      } else {
        setError('Failed to remove item from cart.');
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError('There was an error removing the item.');
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      <div className="space-y-6">
        {cart.items.map((item) => {
          const isProduct = item.type === "product";
          const productOrWorkshop = isProduct ? item.product_id : item.workshop_id;

          if (!productOrWorkshop) {
            console.warn(`Missing ${isProduct ? "product_id" : "workshop_id"} for cart item:`, item);
            return null;
          }

          return (
            <div
              key={productOrWorkshop._id}
              className="flex items-center border-b pb-4 mb-4 last:mb-0 last:border-b-0"
            >
              <img
                src={productOrWorkshop.images?.[0] || "/placeholder-image.jpg"}
                alt={productOrWorkshop.title || productOrWorkshop.classTitle || "Item"}
                className="w-24 h-24 object-cover rounded-lg mr-6"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {productOrWorkshop.title || productOrWorkshop.classTitle || "Unknown Item"}
                </h2>
                <p className="text-lg text-gray-600">
                  Price: €{productOrWorkshop.price || "N/A"}
                </p>

                <div className="flex items-center space-x-2 text-lg text-gray-600">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(productOrWorkshop._id, item.quantity - 1, item.type)
                    }
                    className="text-blue-500 hover:text-blue-700"
                    disabled={item.quantity <= 1}
                  >
                    <FaArrowDown />
                  </button>
                  <span>Quantity: {item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(productOrWorkshop._id, item.quantity + 1, item.type)
                    }
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaArrowUp />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  €{(productOrWorkshop.price * item.quantity).toFixed(2) || "N/A"}
                </p>
              </div>

              <div className="ml-4">
                <button
                  onClick={() => handleRemoveItem(productOrWorkshop._id, item.type)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center py-4 mt-6 border-t">
        <h2 className="text-2xl font-semibold">Total:</h2>
        <p className="text-xl font-bold text-green-600">
          €{cart.items.reduce((acc, item) => {
            const productOrWorkshop = item.type === "product" ? item.product_id : item.workshop_id;
            return acc + (productOrWorkshop?.price || 0) * item.quantity;
          }, 0).toFixed(2)}
        </p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleCheckout}
          className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
