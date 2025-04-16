import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel";
import AddToCart from "../components/AddToCart";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3050/shop/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product", err));

    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [id]);

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
          <p className="text-lg text-gray-600 mb-4">
            Keywords: {product.keywords.join(", ")}
          </p>
          <p className="text-lg text-gray-800 mb-4">{product.description}</p>
          <div>
            <p>Stock: {product.stock}</p>
          </div>

          <div className="text-xl font-bold text-green-600 mb-6">
            {product.price}€
          </div>

          {/* Add to Cart Button */}
          <AddToCart productId={product._id} userRole={userRole} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
