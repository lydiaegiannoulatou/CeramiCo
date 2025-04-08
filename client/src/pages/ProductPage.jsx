import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to access route parameters
import axios from "axios";

import ImageCarousel from "../components/ImageCarousel"; // Import the ImageCarousel component

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState();

  useEffect(() => {
    // Fetch the product data using the ID from the route
    axios
      .get(`http://localhost:3050/shop/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product", err));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex">
        <div className="w-1/2 pr-10">
          {/* Use the ImageCarousel component here */}
          <ImageCarousel images={product.images} />
        </div>
        <div className="w-1/2 pl-10">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-lg text-gray-600 mb-4">Keywords:
            {product.keywords.join(", ")}
          </p>
          <p className="text-lg text-gray-800 mb-4">{product.description}</p>
          <div className="text-xl font-bold text-green-600 mb-6">
            {product.price}€
          </div>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
