import React, { useState } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

const AddToCart = ({ product, showLabel = true }) => {
  const [isAdding, setIsAdding] = useState(false);
  const role = localStorage.getItem("role");

  // 🔒 Guard clause if product is not defined
  if (!product || !product._id) return null;

  const { _id, stock } = product;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to be logged in to add items to the cart.");
      return;
    }

    if (stock === 0) {
      toast.warning("This product is currently out of stock.");
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post(
        "http://localhost:3050/cart/add-to-cart",
        {
          items: [{ product_id: _id, quantity: 1 }],
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

  // Only show if logged in user is a "user"
  if (role !== "user") return null;

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center ${
        showLabel ? "py-2 px-6" : "p-3"
      } bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-gray-400`}
      disabled={isAdding || stock === 0}
      title={stock === 0 ? "Out of stock" : "Add to cart"}
    >
      {stock === 0 ? (
        showLabel ? (
          <>
            <FaShoppingCart className="mr-2" />
            Out of Stock
          </>
        ) : (
          <FaShoppingCart />
        )
      ) : isAdding ? (
        showLabel ? (
          <>
            <FaShoppingCart className="mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <FaShoppingCart className="animate-spin" />
        )
      ) : showLabel ? (
        <>
          <FaShoppingCart className="mr-2" />
          Add to Cart
        </>
      ) : (
        <FaShoppingCart />
      )}
    </button>
  );
};

export default AddToCart;
