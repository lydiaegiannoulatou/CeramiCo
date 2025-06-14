import React, { useState, useContext } from "react";
import axios from "axios";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext"; 

const AddToCart = ({ item, showLabel = true, quantity = 1 }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { user, isLoggedIn, isAuthReady } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token"); 

  if (!isAuthReady || !item || !item._id) return null;

  const { _id, stock, price } = item;
  const role = user?.role;
  const isOutOfStock = stock === 0;
  const isNotEnoughStock = quantity > stock;

  const handleAddToCart = async () => {
    if (!isLoggedIn || role !== "user") {
      toast.warning("You must be logged in as a user to add items to the cart.");
      return;
    }

    if (isOutOfStock) {
      toast.warning("This product is currently out of stock.");
      return;
    }

    if (isNotEnoughStock) {
      toast.warning(`Only ${stock} ${stock === 1 ? "item" : "items"} available in stock.`);
      return;
    }

    setIsAdding(true);
    try {
      const payload = {
        items: [
          {
            type: "product",
            quantity,
            price,
            product_id: _id,
          },
        ],
      };

      const response = await axios.post(
        `${baseUrl}/cart/add-to-cart`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(`${quantity} ${quantity === 1 ? "item" : "items"} added to cart!`);
      } else {
        toast.error(response.data.msg || "Failed to add to cart.");
      }
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center ${
        showLabel ? "py-3 px-8" : "p-4"
      } bg-[#5b3b20] hover:bg-[#4a2e18] active:bg-[#3d2713] text-white rounded-lg transition-all duration-300 ${
        isAdding || isOutOfStock || isNotEnoughStock
          ? "opacity-60 cursor-not-allowed"
          : ""
      }`}
      disabled={isAdding || isOutOfStock || isNotEnoughStock}
      title={
        !isLoggedIn || role !== "user"
          ? "Login required"
          : isOutOfStock
          ? "Out of Stock"
          : isNotEnoughStock
          ? `Only ${stock} available`
          : "Add to cart"
      }
    >
      {isOutOfStock ? (
        showLabel ? (
          <span className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Out of Stock
          </span>
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )
      ) : isAdding ? (
        showLabel ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Adding...
          </span>
        ) : (
          <Loader2 className="h-5 w-5 animate-spin" />
        )
      ) : showLabel ? (
        <span className="flex items-center font-medium">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </span>
      ) : (
        <ShoppingCart className="h-5 w-5" />
      )}
    </button>
  );
};

export default AddToCart;
