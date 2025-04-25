import React, { useState } from "react";
import axios from "axios";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const AddToCart = ({
  item,
  type = "product",
  showLabel = true,
  quantity = 1,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!item || !item._id) return null;

  const { _id, stock, price } = item;
  const isOutOfStock = type === "product" && stock === 0;
  const isNotEnoughStock = type === "product" && quantity > stock;

  const handleAddToCart = async () => {
    if (!token || role !== "user") {
      toast.info(
        "You need to be logged in as a user to add items to the cart."
      );
      return;
    }

    if (isOutOfStock) {
      toast.warning("This product is currently out of stock.");
      return;
    }

    if (isNotEnoughStock) {
      toast.warning(`Only ${stock} items available in stock.`);
      return;
    }

    setIsAdding(true);
    try {
      const payload = {
        items: [
          {
            quantity,
            price,
            product_id: _id,
          },
        ],
      };

      const response = await axios.post(
        "http://localhost:3050/cart/add-to-cart",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(
          `${quantity} ${quantity === 1 ? "item" : "items"} added to cart!`
        );
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
        !token || role !== "user"
          ? "Login required"
          : isOutOfStock
          ? "Out of Stock"
          : isNotEnoughStock
          ? `Only ${stock} available`
          : "Add to cart"
      }
    >
      {isAdding ? (
        <Loader2 className="animate-spin mr-2" />
      ) : (
        <ShoppingCart className="mr-2" />
      )}
      {isOutOfStock
        ? "Out of Stock"
        : isNotEnoughStock
        ? `Only ${stock} available`
        : "Add to cart"}
    </button>
  );
};

export default AddToCart;
