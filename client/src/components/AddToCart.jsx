import React, { useState } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddToCart = ({ productId, userRole }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to be logged in to add items to the cart.");
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post(
        "http://localhost:3050/cart/add-to-cart",
        {
          items: [{ product_id: productId, quantity: 1 }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Product added to the cart!");
      } else {
        toast.error(response.data.msg || "Failed to add product to cart.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsAdding(false);
    }
  };

  if (userRole !== "user") {
    return null;
  }

  return (
    <button
      onClick={handleAddToCart}
      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition disabled:opacity-50"
      disabled={isAdding}
      title="Add to cart"
    >
      <FaShoppingCart />
    </button>
  );
};

export default AddToCart;
