import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel";
import AddToCart from "../components/AddToCart";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3050/shop/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Error fetching product", err);
        setError("Failed to load product. Please try again later.");
      });

    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [id]);

  if (!product) {
    return <div className="p-6 text-lg">Loading product...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 md:pr-10">
          <ImageCarousel images={product.images || []} />
        </div>

        <div className="md:w-1/2 md:pl-10">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-lg text-gray-600 mb-4">
            Keywords: {product.keywords.join(", ")}
          </p>
          <p className="text-lg text-gray-800 mb-4">{product.description}</p>

          <div className="mb-4">
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Price:</strong> {product.price}€</p>
          </div>

          {error && <div className="text-red-500 mb-2">{error}</div>}

          {userRole === "user" ? (
            <AddToCart product={product} showLabel={true} />
          ) : (
            <p className="text-gray-500 italic">
              Admins cannot add products to the cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
