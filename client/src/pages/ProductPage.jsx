import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to access route parameters
import axios from "axios";

import ImageCarousel from "../components/ImageCarousel"; // Import the ImageCarousel component

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState();
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Track adding status (e.g., loading)

  useEffect(() => {
    // Fetch the product data using the ID from the route
    axios
      .get(`http://localhost:3050/shop/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product", err));
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    
    if (!token) {
      // Handle case when the user is not logged in
      setError('You need to be logged in to add items to the cart.');
      return;
    }

    setIsAdding(true); // Set adding state to true while the request is in progress
    try {
      // Send a request to add the product to the cart
      const response = await axios.post(
        'http://localhost:3050/cart/add-to-cart',  
        {
          items: [
            {
              product_id: product._id,
              quantity: 1, // Modify if needed
            },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert('Product added to the cart successfully!');
      } else {
        setError(response.data.msg || 'Failed to add product to cart.');
      }
    } catch (err) {
      console.log('Error adding product to cart:', err);
      setError('There was an error adding the product to the cart. Please try again later.');
    } finally {
      setIsAdding(false); // Reset adding state
    }
  };

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

          {/* Error message if any */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Add to Cart button */}
          <button 
            onClick={handleAddToCart}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            disabled={isAdding} // Disable button while adding to cart
          >
            {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
