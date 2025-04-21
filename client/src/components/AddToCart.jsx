import React, { useState } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

const AddToCart = ({ item, type = "product", showLabel = true }) => {
  const [isAdding, setIsAdding] = useState(false);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!item || !item._id) return null;

  const { _id, stock, maxSpots, bookedSpots, price } = item;

  const isOutOfStock =
    type === "product"
      ? stock === 0
      : type === "workshop"
      ? bookedSpots >= maxSpots
      : false;

  const handleAddToCart = async () => {
    const normalizedType = type?.toLowerCase?.();

    if (!token || role !== "user") {
      toast.info("You need to be logged in as a user to add items to the cart.");
      return;
    }

    if (isOutOfStock) {
      toast.warning(
        normalizedType === "product"
          ? "This product is currently out of stock."
          : "This workshop is fully booked."
      );
      return;
    }

    setIsAdding(true);
    try {
      const payload = {
        items: [
          {
            type: normalizedType,
            quantity: 1,
            price,
            ...(normalizedType === "product"
              ? { product_id: _id }
              : { workshop_id: _id }),
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
          normalizedType === "product"
            ? "Product added to the cart!"
            : "Workshop added to the cart!"
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
        showLabel ? "py-2 px-6" : "p-3"
      } bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition ${
        isAdding || isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isAdding || isOutOfStock}
      title={
        !token || role !== "user"
          ? "Login required"
          : isOutOfStock
          ? "Unavailable"
          : "Add to cart"
      }
    >
      {isOutOfStock ? (
        showLabel ? (
          <>
            <FaShoppingCart className="mr-2" />
            {type === "product" ? "Out of Stock" : "Fully Booked"}
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
