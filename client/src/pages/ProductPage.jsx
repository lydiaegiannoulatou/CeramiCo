import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [userRole, setUserRole] = useState(""); // <-- New state for role

  useEffect(() => {
    axios
      .get(`http://localhost:3050/shop/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product", err));

    // Get the user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You need to be logged in to add items to the cart.");
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post(
        "http://localhost:3050/cart/add-to-cart",
        {
          items: [
            {
              product_id: product._id,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Product added to the cart successfully!");
      } else {
        setError(response.data.msg || "Failed to add product to cart.");
      }
    } catch (err) {
      console.log("Error adding product to cart:", err);
      setError("There was an error adding the product to the cart. Please try again later.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 md:pr-10">
          <ImageCarousel images={product.images} />
        </div>
        <div className="md:w-1/2 md:pl-10">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-lg text-gray-600 mb-4">Keywords: {product.keywords.join(", ")}</p>
          <p className="text-lg text-gray-800 mb-4">{product.description}</p>
          <div>
            <p>Stock: {product.stock}</p>
          </div>

          <div className="text-xl font-bold text-green-600 mb-6">
            {product.price}€
          </div>

          {error && <div className="text-red-500 mb-2">{error}</div>}

          {/* Conditionally render button for user role */}
          {userRole === "user" ? (
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
              disabled={isAdding}
            >
              {isAdding ? "Adding to Cart..." : "Add to Cart"}
            </button>
          ) : (
            <p className="text-gray-500 italic">Admins cannot add products to the cart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
